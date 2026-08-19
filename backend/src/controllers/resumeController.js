export const generateResume = (req, res) => {
    const { name, skills } = req.body;

    res.json({
        message: "Resume generated successfully",
        data: {
            name,
            skills,
        },
    });
};