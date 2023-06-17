// Déclaration des variables
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

// Insérer du texte dans le canvas en spécifiant quel texte, sa taille, sa police, sa couleur et son alignement
context.font = '25px Arial';
context.fillStyle = '#5ecde6';
context.textAlign = 'center';
context.fillText('À VENIR : ÉDITION 2023', canvas.width/2, canvas.height/2);