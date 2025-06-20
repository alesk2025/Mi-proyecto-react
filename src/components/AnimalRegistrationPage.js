import React, { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { classifyAnimalAge } from '../utils/helpers'; // Importar la función de utilidad

const AnimalRegistrationPage = ({ onRegisterAnimal, onUpdateAnimalProduction, animals, currentUser, logoUrl }) => {
  const [animalData, setAnimalData] = useState({
    id: '', // Campo para el ID manual
    name: '',
    raza: '',
    peso: '',
    sexo: '',
    fechaNacimiento: '',
    fechaCompra: '',
    tipoProduccion: '',
    dailyMilk: 0,
    foto: null,
    idpadre: '',
    idmadre: '',
    estadoReproductivo: 'desarrollo',
    edadClasificada: '', // Nuevo campo para la clasificación de edad
  });
  const [selectedAnimalForGenealogy, setSelectedAnimalForGenealogy] = useState('');
  const [genealogyTree, setGenealogyTree] = useState(null);

  // Actualiza la clasificación de edad cuando cambian fechaNacimiento o sexo
  useEffect(() => {
    const { fechaNacimiento, sexo } = animalData;
    if (fechaNacimiento && sexo) {
      setAnimalData(prevData => ({
        ...prevData,
        edadClasificada: classifyAnimalAge(fechaNacimiento, sexo),
      }));
    } else {
      setAnimalData(prevData => ({
        ...prevData,
        edadClasificada: '',
      }));
    }
  }, [animalData.fechaNacimiento, animalData.sexo]);

  // Manejador genérico para cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnimalData({ ...animalData, [name]: value });
  };

  // Manejador para la carga de archivos (fotos)
  const handleFileChange = (e) => {
    setAnimalData({ ...animalData, foto: e.target.files[0] });
  };

  // Manejador para el envío del formulario de registro de animal
  const handleSubmit = () => {
    if (!animalData.id) {
      alert('Por favor, ingresa un ID para el animal.');
      return;
    }
    // Validar que el ID sea único
    if (animals.some(animal => animal.id === animalData.id)) {
      alert('El ID del animal ya existe. Por favor, ingresa un ID único.');
      return;
    }

    const animalToRegister = { ...animalData };
    onRegisterAnimal(animalToRegister);
    alert(`Animal ${animalToRegister.name} (${animalToRegister.id}) registrado.`);
    // Limpiar formulario después del registro
    setAnimalData({
      id: '', name: '', raza: '', peso: '', sexo: '', fechaNacimiento: '', fechaCompra: '',
      tipoProduccion: '', dailyMilk: 0, foto: null, idpadre: '', idmadre: '',
      estadoReproductivo: 'desarrollo', edadClasificada: '',
    });
  };

  // Función para descargar la ficha PDF de un animal
  const handleDownloadPDF = useCallback((animal, currentUser, logoUrl) => {
    if (!animal || !animal.id) {
      alert('Por favor, selecciona un animal válido.');
      return;
    }

    const farmName = currentUser?.farmName || 'Mi Finca Ganadera';
    const adminName = currentUser?.fullName || 'Administrador';
    const defaultLogo = 'https://via.placeholder.com/80x80?text=LOGO'; // Default logo if none uploaded
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${animal.id}&size=100x100`; // QR más grande

    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm'; // Ancho A4
    tempDiv.style.padding = '15mm'; // Menos padding para más contenido
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '10pt';
    tempDiv.style.backgroundColor = '#f8f8f8'; // Fondo ligeramente gris
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';

    const colorEstado = animal.estadoReproductivo === 'en_produccion' ? '#27ae60' :
                        animal.estadoReproductivo === 'seca' ? '#e67e22' :
                        animal.estadoReproductivo === 'preñada' ? '#9b59b6' : '#7f8c8d';

    tempDiv.innerHTML = `
      <div style="border: 1px solid #ddd; border-radius: 12px; overflow: hidden; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #2c3e50; color: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <img src="${logoUrl || defaultLogo}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" alt="Logo Finca">
          <div style="text-align: right;">
            <h1 style="margin: 0; font-size: 24pt; font-weight: bold;">${farmName}</h1>
            <p style="margin: 0; font-size: 12pt; opacity: 0.8;">Ficha de Registro Animal</p>
          </div>
        </div>

        <div style="padding: 25px; display: flex; gap: 25px; align-items: flex-start;">
          <div style="flex-shrink: 0; text-align: center;">
            <img src="${animal.foto ? URL.createObjectURL(animal.foto) : 'https://via.placeholder.com/150x150?text=Sin+Foto'}" style="width: 150px; height: 150px; border-radius: 8px; object-fit: cover; border: 2px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" alt="Foto del animal">
            <h2 style="font-size: 18pt; margin-top: 15px; margin-bottom: 5px; color: #333;">${animal.name || 'N/A'}</h2>
            <p style="font-size: 12pt; color: #777; margin: 0;">ID: ${animal.id || 'N/A'}</p>
          </div>
          <div style="flex-grow: 1;">
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Raza:</strong></td><td style="padding: 8px 0;">${animal.raza || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Peso:</strong></td><td style="padding: 8px 0;">${animal.peso || 'N/A'} kg</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Sexo:</strong></td><td style="padding: 8px 0;">${animal.sexo || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Fecha Nacimiento:</strong></td><td style="padding: 8px 0;">${animal.fechaNacimiento || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Clasificación Edad:</strong></td><td style="padding: 8px 0;">${animal.edadClasificada || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Fecha Compra:</strong></td><td style="padding: 8px 0;">${animal.fechaCompra || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>ID Padre:</strong></td><td style="padding: 8px 0;">${animal.idpadre || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>ID Madre:</strong></td><td style="padding: 8px 0;">${animal.idmadre || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Estado Reproductivo:</strong></td><td style="padding: 8px 0; color: ${colorEstado}; font-weight: bold;">${animal.estadoReproductivo || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Tipo Producción:</strong></td><td style="padding: 8px 0;">${animal.tipoProduccion || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;"><strong>Litros Leche Diarios:</strong></td><td style="padding: 8px 0;">${animal.dailyMilk || 'N/A'}</td></tr>
            </table>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; background-color: #f0f0f0; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
          <img src="${qrURL}" style="width: 100px; height: 100px; margin-bottom: 10px;" alt="QR Code del animal">
          <p style="font-size: 9pt; color: #555; margin: 0;">Escanea para más información</p>
        </div>

        <div style="text-align: right; font-size: 8pt; padding: 10px 20px; color: #aaa; background-color: #f8f8f8; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
          <p style="margin: 0;">Generado por Campo Inteligente | Administrador: ${adminName}</p>
          <p style="margin: 0;">Fecha de Generación: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pageHeight; // Corregido: restar pageHeight para la posición
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ficha_animal_${animal.name || 'sin_nombre'}_${animal.id || 'sin_id'}.pdf`);
      document.body.removeChild(tempDiv);
    });
  }, [animals, currentUser, logoUrl]); // Dependencias para useCallback

  // Manejador para actualizar producción/estado del animal
  const handleUpdateProduction = () => {
    if (animalData.id) {
      onUpdateAnimalProduction(animalData.id, animalData.estadoReproductivo, animalData.dailyMilk);
      alert(`Producción/Estado de ${animalData.id} actualizado.`);
    } else {
      alert('Por favor, ingresa el ID del animal para actualizar su producción/estado.');
    }
  };

  // Función para construir el árbol genealógico
  const buildGenealogyTree = useCallback((animalId, allAnimals) => {
    const animal = allAnimals.find(a => a.id === animalId);
    if (!animal) return null;

    const tree = {
      id: animal.id,
      name: animal.name,
      raza: animal.raza,
      sexo: animal.sexo,
      children: []
    };

    // Buscar hijos directos
    const children = allAnimals.filter(a => a.idpadre === animal.id || a.idmadre === animal.id);
    if (children.length > 0) {
      tree.children = children.map(child => ({
        id: child.id,
        name: child.name,
        raza: child.raza,
        sexo: child.sexo,
      }));
    }

    // Buscar padres directos
    if (animal.idpadre) {
      tree.father = allAnimals.find(a => a.id === animal.idpadre);
    }
    if (animal.idmadre) {
      tree.mother = allAnimals.find(a => a.id === animal.idmadre);
    }

    return tree;
  }, [animals]); // Dependencia para useCallback

  // Manejador para ver el árbol genealógico
  const handleViewGenealogy = () => {
    if (!selectedAnimalForGenealogy) {
      alert('Por favor, selecciona un animal para ver su árbol genealógico.');
      return;
    }
    const tree = buildGenealogyTree(selectedAnimalForGenealogy, animals);
    setGenealogyTree(tree);
    if (!tree) {
      alert('Animal no encontrado o sin información genealógica.');
    }
  };

  // Manejador para descargar el PDF del árbol genealógico
  const handleDownloadGenealogyPDF = useCallback(() => {
    if (!genealogyTree) {
      alert('Primero visualiza un árbol genealógico para descargarlo.');
      return;
    }

    const farmName = currentUser?.farmName || 'Mi Finca Ganadera';
    const adminName = currentUser?.fullName || 'Administrador';
    const defaultLogo = 'https://via.placeholder.com/60x60?text=LOGO'; // Default logo if none uploaded

    const treeDiv = document.createElement('div');
    treeDiv.style.width = '210mm'; // Ancho A4
    treeDiv.style.padding = '15mm';
    treeDiv.style.fontFamily = 'Arial, sans-serif';
    treeDiv.style.fontSize = '10pt';
    treeDiv.style.backgroundColor = '#f8f8f8';
    treeDiv.style.position = 'absolute';
    treeDiv.style.left = '-9999px';
    treeDiv.style.top = '-9999px';

    // Función para renderizar un nodo del árbol con estilo moderno
    const renderNode = (node, type = 'main') => {
      let bgColor = '#e0f7fa'; // Default for main
      let textColor = '#00796b';
      let borderColor = '#00bcd4';
      let title = 'Animal Principal';

      if (type === 'father') {
        bgColor = '#e8f5e9';
        textColor = '#2e7d32';
        borderColor = '#4caf50';
        title = 'Padre';
      } else if (type === 'mother') {
        bgColor = '#fce4ec';
        textColor = '#c2185b';
        borderColor = '#e91e63';
        title = 'Madre';
      } else if (type === 'child') {
        bgColor = '#fff3e0';
        textColor = '#ef6c00';
        borderColor = '#ff9800';
        title = 'Hijo/a';
      }

      return `
        <div style="background-color: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 8px; padding: 15px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h4 style="margin: 0 0 8px 0; font-size: 12pt; color: ${textColor}; font-weight: bold;">${title}</h4>
          <p style="margin: 0; font-size: 11pt; color: #333;"><strong>${node.name}</strong> (${node.id})</p>
          <p style="margin: 5px 0 0 0; font-size: 10pt; color: #555;">Raza: ${node.raza}, Sexo: ${node.sexo}</p>
        </div>
      `;
    };

    treeDiv.innerHTML = `
      <div style="border: 1px solid #ddd; border-radius: 12px; overflow: hidden; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #2c3e50; color: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <img src="${logoUrl || defaultLogo}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" alt="Logo Finca">
          <div style="text-align: right;">
            <h1 style="margin: 0; font-size: 20pt; font-weight: bold;">${farmName}</h1>
            <p style="margin: 0; font-size: 10pt; opacity: 0.8;">Árbol Genealógico</p>
          </div>
        </div>

        <div style="padding: 25px;">
          <h3 style="font-size: 16pt; margin-bottom: 20px; text-align: center; color: #333;">Genealogía de ${genealogyTree.name} (${genealogyTree.id})</h3>
          
          <div style="display: flex; flex-direction: column; align-items: center;">
            ${renderNode(genealogyTree, 'main')}
            
            <div style="display: flex; justify-content: center; gap: 20px; width: 100%; margin-top: 20px;">
              ${genealogyTree.father ? renderNode(genealogyTree.father, 'father') : ''}
              ${genealogyTree.mother ? renderNode(genealogyTree.mother, 'mother') : ''}
            </div>

            ${genealogyTree.children.length > 0 ? `
              <h4 style="font-size: 14pt; margin-top: 30px; margin-bottom: 15px; color: #333;">Hijos Directos:</h4>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; width: 100%;">
                ${genealogyTree.children.map(child => renderNode(child, 'child')).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <div style="text-align: right; font-size: 8pt; padding: 10px 20px; color: #aaa; background-color: #f8f8f8; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
          <p style="margin: 0;">Generado por Campo Inteligente | Administrador: ${adminName}</p>
          <p style="margin: 0;">Fecha de Generación: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    document.body.appendChild(treeDiv);

    html2canvas(treeDiv, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`arbol_genealogico_${genealogyTree.name || 'sin_nombre'}_${genealogyTree.id || 'sin_id'}.pdf`);
      document.body.removeChild(treeDiv);
    });
  }, [genealogyTree, currentUser, logoUrl]); // Dependencias para useCallback

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Registro Animal Avanzado</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="id"
          placeholder="ID del Animal (Único)"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre del Animal"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="raza"
          placeholder="Raza"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.raza}
          onChange={handleInputChange}

        />
        <input
          type="number"
          name="peso"
          placeholder="Peso"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.peso}
          onChange={handleInputChange}

        />
        <select
          name="sexo"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.sexo}
          onChange={handleInputChange}
        >
          <option value="">Selecciona Sexo</option>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
        </select>
        <input
          type="date"
          name="fechaNacimiento"
          placeholder="Fecha de Nacimiento"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.fechaNacimiento}
          onChange={handleInputChange}
        />
        {animalData.edadClasificada && (
          <input
            type="text"
            name="edadClasificada"
            placeholder="Clasificación de Edad"
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            value={animalData.edadClasificada}
            readOnly
          />
        )}
        <input
          type="date"
          name="fechaCompra"
          placeholder="Fecha de Compra (Opcional)"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.fechaCompra}
          onChange={handleInputChange}
        />
        <select
          name="tipoProduccion"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.tipoProduccion}
          onChange={handleInputChange}
        >
          <option value="">Tipo de Producción</option>
          <option value="carne">Carne</option>
          <option value="leche">Leche</option>
        </select>
        {animalData.tipoProduccion === 'leche' && animalData.sexo === 'hembra' && (
          <input
            type="number"
            name="dailyMilk"
            placeholder="Litros Promedio Diarios"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={animalData.dailyMilk}
            onChange={handleInputChange}
          />
        )}
        <input
          type="text"
          name="idpadre"
          placeholder="ID Padre (Opcional)"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.idpadre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="idmadre"
          placeholder="ID Madre (Opcional)"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={animalData.idmadre}
          onChange={handleInputChange}
        />
        <div className="col-span-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">Foto del Animal</label>
          <input
            type="file"
            name="foto"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors mr-2"
      >
        Registrar Animal
      </button>
      <button
        onClick={() => handleDownloadPDF(animalData, currentUser, logoUrl)} // Pasar el logoUrl
        className="mt-6 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Descargar Ficha PDF
      </button>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-semibold mb-3">Actualizar Producción/Estado</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="id"
            placeholder="ID del Animal a Actualizar"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={animalData.id}
            onChange={handleInputChange}
          />
          <select
            name="estadoReproductivo"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={animalData.estadoReproductivo}
            onChange={handleInputChange}
          >
            <option value="desarrollo">En Desarrollo</option>
            <option value="en_produccion">En Producción</option>
            <option value="seca">Seca</option>
            <option value="preñada">Preñada</option>
          </select>
          {animalData.estadoReproductivo === 'en_produccion' && animalData.tipoProduccion === 'leche' && (
            <input
              type="number"
              name="dailyMilk"
              placeholder="Litros de leche diarios"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={animalData.dailyMilk}
              onChange={handleInputChange}
            />
          )}
        </div>
        <button
          onClick={handleUpdateProduction}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualizar Producción
        </button>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-semibold mb-3">Árbol Genealógico</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={selectedAnimalForGenealogy}
            onChange={(e) => setSelectedAnimalForGenealogy(e.target.value)}
          >
            <option value="">Selecciona Animal para Genealogía</option>
            {animals.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
            ))}
          </select>
          <button
            onClick={handleViewGenealogy}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ver Árbol Genealógico
          </button>
        </div>

        {genealogyTree && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h5 className="font-semibold text-gray-800 mb-4">Árbol Genealógico de {genealogyTree.name} ({genealogyTree.id})</h5>
            
            <div className="flex flex-col items-center space-y-6">
              {/* Nodo Principal */}
              <div className="relative p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-md text-center w-64">
                <p className="font-bold text-lg text-blue-800">{genealogyTree.name} ({genealogyTree.id})</p>
                <p className="text-sm text-gray-700">{genealogyTree.raza}, {genealogyTree.sexo}</p>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-300"></div>
              </div>

              {/* Padres */}
              {(genealogyTree.father || genealogyTree.mother) && (
                <div className="flex justify-center space-x-8 w-full">
                  {genealogyTree.father && (
                    <div className="relative p-4 bg-green-100 border border-green-300 rounded-lg shadow-md text-center w-64">
                      <p className="font-bold text-lg text-green-800">Padre: {genealogyTree.father.name} ({genealogyTree.father.id})</p>
                      <p className="text-sm text-gray-700">{genealogyTree.father.raza}, {genealogyTree.father.sexo}</p>
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-green-300"></div>
                    </div>
                  )}
                  {genealogyTree.mother && (
                    <div className="relative p-4 bg-pink-100 border border-pink-300 rounded-lg shadow-md text-center w-64">
                      <p className="font-bold text-lg text-pink-800">Madre: {genealogyTree.mother.name} ({genealogyTree.mother.id})</p>
                      <p className="text-sm text-gray-700">{genealogyTree.mother.raza}, {genealogyTree.mother.sexo}</p>
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-pink-300"></div>
                    </div>
                  )}
                </div>
              )}

              {/* Hijos */}
              {genealogyTree.children.length > 0 && (
                <div className="w-full text-center mt-6">
                  <h5 className="font-semibold text-gray-800 mb-4">Hijos Directos:</h5>
                  <div className="flex flex-wrap justify-center gap-4">
                    {genealogyTree.children.map(child => (
                      <div key={child.id} className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg shadow-sm text-center w-48">
                        <p className="font-bold text-md text-yellow-800">{child.name} ({child.id})</p>
                        <p className="text-sm text-gray-700">{child.raza}, {child.sexo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleDownloadGenealogyPDF}
              className="mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              Descargar Árbol (PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalRegistrationPage;