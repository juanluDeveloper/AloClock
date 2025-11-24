// src/views/UserDashboard.jsx
import React, { useState } from 'react';
import ResumenTab from '../components/user/ResumenTab.jsx';
import SemanasTab from '../components/user/SemanasTab.jsx';
import EventosTab from '../components/user/EventosTab.jsx';
import IncidenciasTab from '../components/user/IncidenciasTab.jsx';
import '../styles.css';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('resumen'); // 'resumen' | 'semanas' | 'eventos' | 'incidencias'

  return (
    <div className="container my-3 my-md-4">
      {/* CABECERA / HERO */}
      <div className="hero-banner mb-4">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-7">
            <div className="d-flex align-items-center mb-2">
              <img
                src="/images/alodent-logo.png"
                alt="Clínica Dental Alodent"
                className="hero-logo me-2"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div>
                <h4 className="mb-0">AloClock</h4>
                <small className="text-muted">
                  Registro de jornada · Clínica Dental Alodent
                </small>
              </div>
            </div>
            <p className="mb-1">
              Ficha tus entradas, pausas y salidas de forma sencilla y
              cumpliendo con el Real Decreto-ley 8/2019.
            </p>
            <span className="badge rounded-pill brand-badge">
              Panel trabajador
            </span>
          </div>
          <div className="col-12 col-md-5">
            <div
              className="hero-photo"
              style={{ backgroundImage: "url('/images/alodent-exterior.jpg')" }}
            />
          </div>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-pills mb-3">
        <li className="nav-item">
          <button
            className={
              'nav-link' +
              (activeTab === 'resumen' ? ' active brand-bg text-white' : '')
            }
            onClick={() => setActiveTab('resumen')}
          >
            Resumen
          </button>
        </li>
        <li className="nav-item">
          <button
            className={
              'nav-link' +
              (activeTab === 'semanas' ? ' active brand-bg text-white' : '')
            }
            onClick={() => setActiveTab('semanas')}
          >
            Semanas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={
              'nav-link' +
              (activeTab === 'eventos' ? ' active brand-bg text-white' : '')
            }
            onClick={() => setActiveTab('eventos')}
          >
            Mis fichajes (eventos)
          </button>
        </li>
        <li className="nav-item">
          <button
            className={
              'nav-link' +
              (activeTab === 'incidencias'
                ? ' active brand-bg text-white'
                : '')
            }
            onClick={() => setActiveTab('incidencias')}
          >
            Incidencias
          </button>
        </li>
      </ul>

      {activeTab === 'resumen' && <ResumenTab />}
      {activeTab === 'semanas' && <SemanasTab />}
      {activeTab === 'eventos' && <EventosTab />}
      {activeTab === 'incidencias' && <IncidenciasTab />}
    </div>
  );
}
