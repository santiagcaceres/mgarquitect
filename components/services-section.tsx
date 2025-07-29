const projectServices = [
  {
    title: "Proyecto de instalaciones sanitarias",
    description:
      "Nos especializamos en el diseño y ejecución de instalaciones de abastecimiento de agua potable, desagües cloacales y pluviales, tratamiento de agua y reúso.",
  },
  {
    title: "Proyectos residenciales",
    description:
      "Diseño integral de viviendas unifamiliares y vivienda colectiva de primer nivel, potenciando la experiencia cotidiana de los usuarios.",
  },
  {
    title: "Proyectos comerciales",
    description: "Diseño de locales comerciales de pequeña y mediana escala.",
  },
  {
    title: "Proyecto ejecutivo",
    description: "Documentación ejecutiva gráfica y escrita para su posterior uso en obra.",
  },
  {
    title: "Servicios freelance",
    description:
      "Ofrecemos servicios de apoyo tales como dibujo técnico y visualización arquitectónica para otros estudios de Arquitectura, Ingeniería y empresas constructoras.",
  },
]

const constructionServices = [
  {
    title: "Supervisión de obras",
    description: "Inspecciones y seguimiento de obras para asegurar la calidad del producto final.",
  },
  {
    title: "Reformas y obra nueva",
    description: "Diseño y gestión integral de obras.",
  },
  {
    title: "Relevamientos",
    description: "Relevamientos de locales y posterior confección de planos del material relevado.",
  },
  {
    title: "Relevamientos topográficos",
    description: "Relevamiento topográficos de terrenos y rectificación de niveles para su posterior replanteo.",
  },
  {
    title: "Presupuestación de obras",
    description: "Metraje de proyectos, cotización de los mismos y optimización de la economía de obra.",
  },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-black">Nuestros Servicios</h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Ofrecemos soluciones arquitectónicas integrales para todo tipo de proyectos
          </p>
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-black mb-3">PROYECTO</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
            {projectServices.slice(0, 2).map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <h4 className="text-lg font-bold mb-3 text-black">{service.title}</h4>
                <p className="text-black leading-relaxed text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projectServices.slice(2).map((service, index) => (
              <div
                key={index + 2}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <h4 className="text-lg font-bold mb-3 text-black">{service.title}</h4>
                <p className="text-black leading-relaxed text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-black mb-3">OBRA</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
            {constructionServices.slice(0, 2).map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <h4 className="text-lg font-bold mb-3 text-black">{service.title}</h4>
                <p className="text-black leading-relaxed text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {constructionServices.slice(2).map((service, index) => (
              <div
                key={index + 2}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <h4 className="text-lg font-bold mb-3 text-black">{service.title}</h4>
                <p className="text-black leading-relaxed text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
