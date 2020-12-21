import React from 'react';

import { getImage } from '../helpers';
import top from '../../public/top.png';
import jungle from '../../public/jungle.png';
import middle from '../../public/middle.png';
import bottom from '../../public/bottom.png';
import support from '../../public/support.png';

const Role = ({ role }) => {
  const roleImageMap = {
    top,
    jungle,
    middle,
    bottom,
    support,
  };

  return (
    <img style={{ filter: 'contrast(0)' }} alt={role} width={32} src={getImage(roleImageMap[role])} />
  );
};

export default Role;
