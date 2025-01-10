const db = require('../database/connection.js')


const getAuth = async (req, res ) =>   {
  await res.json({msg: 'ESTOY EN AUTH'})
}

const getAllAuth = async (req, res) => {
  try {
    const {Id} = req.params;
    const userId = await db

  } catch {

  }
}

/*export const getUserTypeFromDB = async (Id: ) => {
    try{
    const userTypeId = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return userTypeId;
  } catch (error) {
        handleError(error, 'Error Amount Service');
      } finally {
        await disconnectPrisma();
      }
};*/

module.exports = getAuth