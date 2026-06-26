const Banner = () => {
  return (
    <section
      className="text-white pt-5 pb-5 mt-5 border-bottom border-dark"
      style={{
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#000',
        background: 'linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0) 100%), url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1925&q=80") center right / 75% no-repeat #000'
      }}
      aria-label="Banner promocional"
    >
      <div className="container-fluid px-4 px-lg-5 mt-5">
        <div className="row">
          <div className="col-lg-7 col-xl-6">
            <span className="badge bg-brand mb-3 px-3 py-2 text-uppercase" style={{ fontWeight: '900', letterSpacing: '2px', fontSize: '0.8rem', borderRadius: '0' }}>
              <i className="bi bi-star-fill me-1"></i> Premium
            </span>
            <h1 className="display-4 fw-bolder mb-3" style={{ lineHeight: '1.1', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Disfruta donde quieras.<br />Cancela cuando quieras.
            </h1>
            <p className="lead mt-3 mb-4 text-light fw-semibold" style={{ fontSize: '1.2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Explora miles de pel&iacute;culas, series y contenido exclusivo sin interrupciones.
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <a href="#search-section" className="btn btn-brand px-4 py-2 d-flex align-items-center" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-play-fill fs-3 me-2" style={{ lineHeight: '0' }}></i> Empezar a ver
              </a>
              <a href="/favorites" className="btn btn-outline-brand px-4 py-2 d-flex align-items-center" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-bookmark fs-4 me-2" style={{ lineHeight: '0' }}></i> Mi Lista
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Banner;
