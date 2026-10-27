function About() {
  const modelAttributions = [
    { name: "Brain", author: "Open Anatomy / Sketchfab", license: "CC-BY-4.0", note: "Cerebral cortex, lobes, cerebellum, and cranial nerves." },
    { name: "Heart", author: "adimed", license: "CC-BY-4.0", note: "High-detail 3D human heart with atria, ventricles, aorta, and coronary arteries." },
    { name: "Skull", author: "Center for BioMedical Visualization, SGU", license: "CC-BY-4.0", note: "Color-coded cranial and facial bones with landmark orbits." },
    { name: "Inner Ear", author: "University of Dundee School of Medicine", license: "CC-BY-4.0", note: "MRI-segmented 3D inner ear labyrinth, cochlea, and semicircular canals." },
    { name: "Human Skin Layers", author: "Ebers", license: "CC-BY-4.0", note: "Epidermis, dermis, hair follicle, glands, and subcutaneous tissue." },
    { name: "Vein and Artery", author: "CB3D", license: "CC-BY-4.0", note: "Comparative vascular cross-section with bicuspid valves and tunica layers." },
    { name: "Stellate Neuron", author: "PIExr", license: "CC-BY-4.0", note: "Multipolar nerve cell with soma, axon, myelin sheath, and terminals." },
    { name: "Complete Eye", author: "3D4SCI", license: "CC-BY-4.0", note: "Optical layers, cornea, lens, retina, and extraocular muscles." },
    { name: "Stomach", author: "Ebers", license: "CC-BY-4.0", note: "Gastric fundus, body, rugae folds, and pyloric sphincter." },
    { name: "Kidney", author: "University of Dundee", license: "CC-BY-4.0", note: "Renal cortex, pyramids, calyces, renal pelvis, and ureter." },
    { name: "Pancreas", author: "Legatobach", license: "CC-BY-4.0", note: "Pancreatic head, body, tail, and main duct within duodenum loop." }
  ];

  return (
    <div className="container about-page">
      <p className="eyebrow">About the project</p>
      <h1>Built for Anatomy Practice & Education</h1>
      <p>
        This interactive 3D anatomy web application is engineered with a modern React and Vite
        frontend, featuring open-access educational 3D models with full 360° controls and
        structured study guides.
      </p>

      <div className="about-grid">
        <section>
          <h2>Core Technologies</h2>
          <p>
            React, React Router 6, Vite, WebGL / 3D Model Viewers, HTML5 Canvas/SVG,
            and CSS3 responsive design.
          </p>
        </section>
        <section>
          <h2>Key Features</h2>
          <p>
            Real-time keyword search, category filtering, favorites persistence (localStorage),
            full 3D rotation/zoom, and comprehensive structure study guides.
          </p>
        </section>
      </div>

      <section className="attributions-section">
        <h2>3D Model Attributions & Open Licenses</h2>
        <p>
          All 11 anatomical models in this application are free, verified educational assets
          compliant with Creative Commons Attribution 4.0 International (CC-BY-4.0):
        </p>
        <div className="attributions-table-wrapper">
          <table className="attributions-table">
            <thead>
              <tr>
                <th>Anatomy Part</th>
                <th>Author / Source</th>
                <th>License</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {modelAttributions.map((item) => (
                <tr key={item.name}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.author}</td>
                  <td><span className="badge-license">{item.license}</span></td>
                  <td>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default About;
