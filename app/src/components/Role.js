import React from 'react';

import { getImage } from '../helpers';
import TOP from '../../public/top.png';
import JG from '../../public/jg.png';
import MID from '../../public/mid.png';
import ADC from '../../public/adc.png';
import SUPP from '../../public/supp.png';

const Role = ({ role }) => {
  const roleImageMap = {
    TOP,
    JG,
    MID,
    ADC,
    SUPP,
  };

  return (
    <img style={{ filter: 'contrast(0)' }} alt={role} width={24} src={getImage(roleImageMap[role])} />
  );
};

export default Role;
