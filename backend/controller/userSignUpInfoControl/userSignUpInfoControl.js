const Signup = require('../../mongodb/signupMongo/signupMongo');

const getdetails = async (req, res) => {
    try {
        const { permanentId } = req.cookies;

        if (!permanentId) {
            return res.status(401).json({ message: 'Unauthorized: No permanentId found in cookies' });
        }

        const user = await Signup.findOne({ permanentId });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        res.status(200).json({
            permanentId: user.permanentId,
            email: user.email,
            name: user.name,
            phone: user.phone,
            verified: user.verified
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { getdetails };