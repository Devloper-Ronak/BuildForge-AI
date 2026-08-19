import {
  FaRobot,
  FaDatabase,
  FaCode,
  FaRoad
} from "react-icons/fa";

function Features() {

  const features = [

    {
      icon: <FaRobot />,
      title: "AI Project Blueprint",
      desc:
        "Generate a complete software architecture, technology stack, and implementation strategy in seconds."
    },

    {
      icon: <FaDatabase />,
      title: "Database Architecture",
      desc:
        "Automatically design scalable database schemas with optimized relationships."
    },

    {
      icon: <FaCode />,
      title: "REST API Generator",
      desc:
        "Create production-ready API endpoints with authentication and best practices."
    },

    {
      icon: <FaRoad />,
      title: "Development Roadmap",
      desc:
        "Receive a structured roadmap that guides your project from planning to deployment."
    }

  ];

  return (

    <section id="features" className="features">

      <div className="section-tag">
        PLATFORM FEATURES
      </div>

      <h2>
        Everything You Need To Build
        <span> Production-Ready Software</span>
      </h2>

      <p className="section-subtitle">
        BuildForge AI generates everything required to transform your
        idea into a scalable full-stack application.
      </p>

      <div className="cards">

        {features.map((feature, index) => (

          <div
            className="feature-card"
            key={index}
          >

            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>

          </div>

        ))}

      </div>

    </section>

  );
}

export default Features;