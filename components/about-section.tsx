export function AboutSection() {
  return (
    <section id="nosotros" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-black">Quiénes Somos</h2>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-base text-black leading-relaxed">
              <p className="text-lg font-medium text-black">
                MG Arquitectura es un estudio especializado en el desarrollo integral de proyectos arquitectónicos,
                donde cada diseño nace de la perfecta armonía entre funcionalidad, estética y viabilidad constructiva.
              </p>

              <p>
                Nuestro enfoque se centra en la arquitectura residencial y comercial, complementado con servicios
                especializados en instalaciones sanitarias y gestión integral de obras. Creemos que cada proyecto es
                único y merece una solución personalizada que refleje las necesidades y aspiraciones de nuestros
                clientes.
              </p>

              <p>
                Con una sólida experiencia trabajando tanto con clientes particulares como empresas asociadas en
                Uruguay, Argentina y España, hemos consolidado nuestra reputación basada en la excelencia técnica, la
                innovación constante y el compromiso inquebrantable con la calidad.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-black">Nuestra Filosofía</h3>
                <p className="text-black leading-relaxed">
                  Transformamos ideas en espacios habitables que mejoran la calidad de vida de las personas, siempre
                  priorizando la sostenibilidad, la funcionalidad y la belleza arquitectónica.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-black">Nuestro Compromiso</h3>
                <p className="text-black leading-relaxed">
                  Mantenemos una comunicación transparente y fluida en todas las etapas del proyecto, garantizando que
                  cada detalle cumpla con los más altos estándares de calidad y diseño.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
