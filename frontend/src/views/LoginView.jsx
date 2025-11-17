import React from 'react';

export default function LoginView({ onLogin }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    await onLogin(email, password);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card card-soft p-4">
              <div className="text-center mb-3">
                {/* Logo: pon tu ruta real */}
                <img
                  src="/images/alodent-logo.png"
                  alt="Clínica Dental Alodent"
                  className="img-fluid mb-2"
                  style={{ maxHeight: '70px' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h5 className="mb-0">AloClock</h5>
                <small className="text-muted">
                  Control de jornada · Clínica Dental Alodent
                </small>
              </div>

              <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="juan@alodent.es"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-pill brand-bg border-0"
                >
                  Iniciar sesión
                </button>
              </form>

              <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.8rem' }}>
                Uso interno para el registro de jornada del equipo de Alodent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
