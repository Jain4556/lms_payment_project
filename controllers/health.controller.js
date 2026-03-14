import { getDBStatus } from "../database/db";


export const checkHealth = async (req, res) => {
    try {
        const dbStatus = getDBStatus()

        const healthStatus = {
            status: 'OK',
            timeStamp: new Date().toISOString,
            services: {
                database: {
                    status: dbStatus.isConnected ? 'healthly' : 'unhealthy',
                    details: {
                        ...dbStatus,
                        readyState: getReadyStateText(dbStatus.readyState)
                    }
                },
                server: {
                    status: 'healthy',
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage(),

                }
            }
        }

        const httpsStatus = healthStatus.services.database.status === 'healthy' ? 200 : 503

        res.status(httpsStatus).json((healthStatus))
    } catch (error) {
        console.error('healthcheck failed')
        res.status(500).json({
            status: 'ERROR',
            timeStamp: new Date.now().toISOString,
            error: error.message
        })
    }
}


// utility method
function getReadyStateText(state) {
    switch (state) {
        case 0: return 'disconnnected';
        case 1: return 'connected';
        case 2: return 'connecting';
        case 3: return 'disconnecting';

            break;

        default: return 'unknown'

    }
}