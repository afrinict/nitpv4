import React from 'react';

export const Marquee: React.FC = () => (
  <div className="w-full bg-gradient-to-r from-green-600 via-blue-600 to-green-600 text-white py-2 overflow-hidden relative shadow-md">
    <div className="whitespace-nowrap animate-marquee text-center text-sm md:text-base font-semibold">
      <span className="mx-8">🌍 Support climate change action! Join us in building a sustainable future.</span>
      <span className="mx-8">🚽 Say NO to open defecation. Keep our communities clean and healthy!</span>
      <span className="mx-8">🌱 Nigerian Institute of Town Planners, Abuja Chapter</span>
      <span className="mx-8">📍 NITP Bawa Bwari House, Plot 2047, Michael Okpara Way, Wuse Zone 5, PMB 7012, Garki, Abuja-FCT</span>
      <span className="mx-8">📞 Contact: +234 (0)8033154688, +234 (0)9080022773, +234 (0)8037870800</span>
    </div>
  </div>
);

export default Marquee; 