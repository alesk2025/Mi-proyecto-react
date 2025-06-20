// Función para clasificar la edad del animal
export const classifyAnimalAge = (fechaNacimiento, sexo) => {
  if (!fechaNacimiento) return 'N/A';

  const birthDate = new Date(fechaNacimiento);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 1) {
    if (months < 6) {
      return sexo === 'macho' ? 'Ternero' : 'Ternera';
    } else {
      return sexo === 'macho' ? 'Maute' : 'Mauta';
    }
  } else if (years >= 1 && years < 2) {
    return sexo === 'macho' ? 'Maute' : 'Mauta';
  } else if (years >= 2 && years < 3) {
    return sexo === 'macho' ? 'Novillo' : 'Novilla';
  } else {
    return sexo === 'macho' ? 'Toro' : 'Vaca';
  }
};