import React, { useState, useEffect } from 'react';
import { getClinics } from './ClinicAPI';
import './ClinicStyles.css';

const ClinicData = () => {
  return (
    <>
      <div className="vaccinationtitle">
        <h2>Vaccinations</h2>
      </div>
      <section className="articles">
        <article>
          <div className="article-wrapper">
            <div className="article-body">
              <h3>Minmed Clinic (Pasir Ris)</h3>
              <ul className="card-list-group">
                <li className="card-list-group-item"><i className="fa fa-location-arrow" aria-hidden="true"></i>
                  1 Pasir Ris Central Street 3 #05-08/09 White Sands, S518457</li>
                <li className="card-list-group-item"><i className="fa fa-phone" aria-hidden="true"></i> 65850123</li>
                <li className="card-list-group-item"><i className="fa fa-info-circle" aria-hidden="true"></i> Moderna/Spikevax XBB.1.5 (12 years old & above)</li>
              </ul>
            </div>
          </div>
        </article>
        <article>

          <div className="article-wrapper">
            <div className="article-body">
              <h3>Minmed Clinic (Woodlands)</h3>
              <ul className="card-list-group">
                <li className="card-list-group-item"><i className="fa fa-location-arrow" aria-hidden="true"></i>
                  6 Woodlands Square #09-06 Woods Square, S737737</li>
                <li className="card-list-group-item"><i className="fa fa-phone" aria-hidden="true"></i> 69740123</li>
                <li className="card-list-group-item"><i className="fa fa-info-circle" aria-hidden="true"></i> Moderna/Spikevax XBB.1.5 (12 years old & above)</li>
              </ul>
            </div>
          </div>
        </article>
        <article>

          <div className="article-wrapper">
            <div className="article-body">
              <h3>Minmed Clinic (Orchard)</h3>
              <ul className="card-list-group">
                <li className="card-list-group-item"><i className="fa fa-location-arrow" aria-hidden="true"></i>
                  290 Orchard Road #16-04 The Paragon, S238859</li>
                <li className="card-list-group-item"><i className="fa fa-phone" aria-hidden="true"></i> 63230123</li>
                <li className="card-list-group-item"><i className="fa fa-info-circle" aria-hidden="true"></i> Pfizer-BioNTech/Comirnaty Omicron XBB.1.5 (12 years old & above)</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default ClinicData;
