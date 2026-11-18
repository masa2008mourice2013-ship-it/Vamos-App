// ¡Vamos! – Inhalte: Städte (= Level), Vokabeln, Fakten, Rezepte
// Hinweis: Die Vokabeln sind Platzhalter-Themen. Sobald das Inhaltsverzeichnis
// von ¡Apúntate! 3 da ist, werden die Level an die Unidades angepasst.

export const CITIES = [
  {
    id: 'start', num: 0, name: 'Lüneburg → Madrid', short: 'Start', code: 'LÜN', unidad: 'Start · Grundwortschatz',
    pos: null, recipe: 'tortilla',
    tag: 'Die ersten Wörter für deine Reise',
    sights: [], food: [], facts: [],
    vocab: [
      ['hola', 'hallo'], ['adiós', 'tschüss'], ['gracias', 'danke'], ['por favor', 'bitte'],
      ['sí', 'ja'], ['no', 'nein'], ['el amigo', 'der Freund'], ['la amiga', 'die Freundin'],
      ['la familia', 'die Familie'], ['el hermano', 'der Bruder'], ['la hermana', 'die Schwester'], ['el instituto', 'die Schule'],
    ],
  },
  {
    id: 'madrid', num: 1, name: 'Madrid', short: 'Madrid', code: 'MAD', unidad: 'Unidad 1 · Stadt & Wege',
    pos: [705, 581], recipe: 'bocadillo',
    tag: 'Die Hauptstadt Spaniens',
    sights: ['Palacio Real', 'Museo del Prado', 'Parque del Retiro'],
    food: ['Bocadillo de calamares', 'Churros con chocolate', 'Cocido madrileño'],
    facts: ['Madrid ist die Hauptstadt und die größte Stadt Spaniens.', 'Hier spielt Real Madrid im Estadio Santiago Bernabéu.', 'Im Museo del Prado hängen berühmte Gemälde von Velázquez und Goya.'],
    vocab: [
      ['la ciudad', 'die Stadt'], ['la calle', 'die Straße'], ['la plaza', 'der Platz'], ['el museo', 'das Museum'],
      ['el parque', 'der Park'], ['el palacio', 'der Palast'], ['la tienda', 'das Geschäft'], ['la estación', 'der Bahnhof'],
      ['el metro', 'die U-Bahn'], ['a la derecha', 'rechts'], ['a la izquierda', 'links'], ['todo recto', 'geradeaus'],
    ],
  },
  {
    id: 'sevilla', num: 2, name: 'Sevilla', short: 'Sevilla', code: 'SEV', unidad: 'Unidad 2 · Wetter & Essen',
    pos: [423, 1093], recipe: 'gazpacho',
    tag: 'Hauptstadt von Andalusien',
    sights: ['Catedral y La Giralda', 'Real Alcázar', 'Plaza de España'],
    food: ['Gazpacho', 'Salmorejo', 'Tapas'],
    facts: ['Sevilla gilt als Heimat des Flamenco.', 'Im Sommer wird es hier oft über 40 Grad heiß.', 'Die Kathedrale ist eine der größten Kirchen der Welt.'],
    vocab: [
      ['el calor', 'die Hitze'], ['hace sol', 'die Sonne scheint'], ['hace frío', 'es ist kalt'], ['llueve', 'es regnet'],
      ['la catedral', 'die Kathedrale'], ['la torre', 'der Turm'], ['bailar', 'tanzen'], ['la naranja', 'die Orange'],
      ['el tomate', 'die Tomate'], ['la sopa', 'die Suppe'], ['rico', 'lecker'], ['beber', 'trinken'],
    ],
  },
  {
    id: 'valencia', num: 3, name: 'Valencia', short: 'Valencia', code: 'VLC', unidad: 'Unidad 3 · Strand & Fiesta',
    pos: [1090, 741], recipe: 'paella',
    tag: 'Stadt am Mittelmeer',
    sights: ['Ciudad de las Artes y las Ciencias', 'La Lonja de la Seda', 'Playa de la Malvarrosa'],
    food: ['Paella valenciana', 'Horchata', 'Fartons'],
    facts: ['Die Paella kommt ursprünglich aus der Gegend um Valencia.', 'Im März feiert die Stadt Las Fallas: Riesige Figuren werden verbrannt.', 'Valencia ist die drittgrößte Stadt Spaniens.'],
    vocab: [
      ['la playa', 'der Strand'], ['el mar', 'das Meer'], ['nadar', 'schwimmen'], ['la arena', 'der Sand'],
      ['el arroz', 'der Reis'], ['la fiesta', 'das Fest'], ['el fuego', 'das Feuer'], ['la música', 'die Musik'],
      ['las vacaciones', 'die Ferien'], ['el barco', 'das Schiff'], ['la toalla', 'das Handtuch'], ['tomar el sol', 'sich sonnen'],
    ],
  },
  {
    id: 'barcelona', num: 4, name: 'Barcelona', short: 'Barcelona', code: 'BCN', unidad: 'Unidad 4 · Sport & Freizeit',
    pos: [1415, 417], recipe: 'pantomate',
    tag: 'Hauptstadt von Katalonien',
    sights: ['Sagrada Família', 'Park Güell', 'Playa de la Barceloneta'],
    food: ['Pan con tomate', 'Crema catalana', 'Escalivada'],
    facts: ['Hier spricht man Katalanisch und Spanisch.', 'An der Sagrada Família von Antoni Gaudí wird seit 1882 gebaut.', 'Am Strand Barceloneta wird viel Beachvolleyball gespielt.'],
    vocab: [
      ['el partido', 'das Spiel'], ['el equipo', 'die Mannschaft'], ['la pelota', 'der Ball'], ['el estadio', 'das Stadion'],
      ['jugar', 'spielen'], ['ganar', 'gewinnen'], ['perder', 'verlieren'], ['el gol', 'das Tor'],
      ['entrenar', 'trainieren'], ['la red', 'das Netz'], ['la iglesia', 'die Kirche'], ['el aficionado', 'der Fan'],
    ],
  },
  {
    id: 'pamplona', num: 5, name: 'Pamplona', short: 'El Toro', code: 'PAM', unidad: 'Endboss · El Toro', boss: true,
    pos: [960, 190], recipe: 'churros',
    tag: 'Hauptstadt von Navarra',
    sights: ['Fiesta de San Fermín', 'Plaza del Castillo', 'Murallas (Stadtmauer)'],
    food: ['Chistorra', 'Pimientos del piquillo', 'Queso Idiazábal'],
    facts: ['Vom 6. bis 14. Juli feiert Pamplona San Fermín.', 'Beim Encierro laufen Menschen morgens vor Stieren durch die Altstadt.', 'Alle tragen Weiß mit einem roten Halstuch.'],
    vocab: [
      ['el toro', 'der Stier'], ['correr', 'rennen'], ['rojo', 'rot'], ['blanco', 'weiß'],
      ['la ciudad', 'die Stadt'], ['la playa', 'der Strand'], ['el partido', 'das Spiel'], ['hace sol', 'die Sonne scheint'],
      ['la estación', 'der Bahnhof'], ['ganar', 'gewinnen'], ['la fiesta', 'das Fest'], ['bailar', 'tanzen'],
    ],
  },
];

export const RECIPES = {
  tortilla: {
    name: 'Tortilla de patatas', city: 'start', time: '45 Min', level: 'Mittel', base: 4, hot: true,
    sub: 'Spanisches Kartoffel-Omelett – das bekannteste Gericht Spaniens',
    ingr: [['patatas medianas', 'mittelgroße Kartoffeln', 4, ''], ['cebolla', 'Zwiebel', 1, ''], ['huevos', 'Eier', 6, ''], ['aceite de oliva', 'Olivenöl', 200, ' ml'], ['sal', 'Salz', 1, ' TL']],
    steps: [
      ['Pela las patatas y córtalas en láminas finas.', 'Kartoffeln schälen und in dünne Scheiben schneiden.'],
      ['Corta la cebolla en trozos pequeños.', 'Die Zwiebel klein schneiden.'],
      ['Fríe las patatas y la cebolla en el aceite a fuego medio, unos 20 minutos.', 'Kartoffeln und Zwiebel im Öl bei mittlerer Hitze etwa 20 Minuten weich braten.'],
      ['Bate los huevos con la sal en un bol grande.', 'Die Eier mit dem Salz in einer großen Schüssel verquirlen.'],
      ['Escurre las patatas y mézclalas con los huevos. Espera 5 minutos.', 'Kartoffeln abtropfen lassen, mit den Eiern mischen und 5 Minuten ziehen lassen.'],
      ['Echa la mezcla en la sartén con un poco de aceite y cocina 4 o 5 minutos.', 'Die Masse mit etwas Öl in die Pfanne geben und 4 bis 5 Minuten stocken lassen.'],
      ['Dale la vuelta con un plato y cocina 3 minutos más.', 'Mit Hilfe eines Tellers wenden und noch 3 Minuten braten.'],
    ],
    vocab: [['pelar', 'schälen'], ['cortar', 'schneiden'], ['freír', 'braten'], ['batir', 'verquirlen'], ['la sartén', 'die Pfanne'], ['darle la vuelta', 'wenden']],
    fun: ['¿Con cebolla o sin cebolla?', 'Mit oder ohne Zwiebel? Darüber streiten sich ganz Spanien und viele Familien. Was meint ihr?'],
  },
  bocadillo: {
    name: 'Bocadillo de calamares', city: 'madrid', time: '25 Min', level: 'Leicht', base: 2, hot: true,
    sub: 'Brötchen mit frittierten Tintenfischringen – ein Klassiker aus Madrid',
    ingr: [['barra de pan', 'Baguette', 1, ''], ['anillas de calamar', 'Tintenfischringe', 300, ' g'], ['harina', 'Mehl', 100, ' g'], ['aceite para freír', 'Öl zum Frittieren', 300, ' ml'], ['limón', 'Zitrone', 1, ''], ['sal', 'Salz', 1, ' Prise']],
    steps: [
      ['Corta el pan por la mitad.', 'Das Brot halbieren.'],
      ['Seca las anillas y pásalas por la harina.', 'Die Ringe trocken tupfen und in Mehl wenden.'],
      ['Fríe las anillas en aceite caliente 2 o 3 minutos.', 'Die Ringe 2 bis 3 Minuten in heißem Öl frittieren.'],
      ['Ponlas sobre papel de cocina y echa sal.', 'Auf Küchenpapier abtropfen lassen und salzen.'],
      ['Rellena el pan y añade unas gotas de limón.', 'Das Brot füllen und ein paar Tropfen Zitrone dazugeben.'],
    ],
    vocab: [['el pan', 'das Brot'], ['la harina', 'das Mehl'], ['caliente', 'heiß'], ['rellenar', 'füllen']],
    fun: ['¿Sabías que…?', 'In Madrid isst man das Bocadillo gern rund um die Plaza Mayor – obwohl die Stadt gar nicht am Meer liegt!'],
  },
  gazpacho: {
    name: 'Gazpacho', city: 'sevilla', time: '20 Min + 2 Std. kühlen', level: 'Leicht', base: 4, hot: false,
    sub: 'Kalte Tomatensuppe aus Andalusien – perfekt bei 40 Grad',
    ingr: [['tomates maduros', 'reife Tomaten', 1000, ' g'], ['pepino', 'Gurke', 1, ''], ['pimiento verde', 'grüne Paprika', 1, ''], ['diente de ajo', 'Knoblauchzehe', 1, ''], ['pan duro', 'altes Brot', 50, ' g'], ['aceite de oliva', 'Olivenöl', 50, ' ml'], ['vinagre', 'Essig', 1, ' EL'], ['sal', 'Salz', 1, ' TL']],
    steps: [
      ['Lava las verduras y córtalas en trozos.', 'Das Gemüse waschen und in Stücke schneiden.'],
      ['Tritura todo con el pan.', 'Alles zusammen mit dem Brot pürieren.'],
      ['Añade el aceite, el vinagre y la sal.', 'Öl, Essig und Salz dazugeben.'],
      ['Mételo en la nevera dos horas.', 'Zwei Stunden in den Kühlschrank stellen.'],
      ['Sírvelo muy frío.', 'Sehr kalt servieren.'],
    ],
    vocab: [['la verdura', 'das Gemüse'], ['triturar', 'pürieren'], ['la nevera', 'der Kühlschrank'], ['frío', 'kalt']],
    fun: ['¿Sopa fría?', 'Gazpacho wird kalt gegessen – manche trinken ihn im Sommer sogar aus dem Glas.'],
  },
  paella: {
    name: 'Paella (vereinfacht)', city: 'valencia', time: '50 Min', level: 'Schwer', base: 4, hot: true,
    sub: 'Reispfanne aus Valencia – hier eine einfache Version mit Hähnchen',
    ingr: [['arroz redondo', 'Rundkornreis', 400, ' g'], ['pollo', 'Hähnchen', 500, ' g'], ['judías verdes', 'grüne Bohnen', 200, ' g'], ['tomate rallado', 'geriebene Tomate', 1, ''], ['caldo', 'Brühe', 1000, ' ml'], ['pimentón', 'Paprikapulver', 1, ' TL'], ['azafrán', 'Safran', 1, ' Prise'], ['aceite de oliva', 'Olivenöl', 50, ' ml']],
    steps: [
      ['Dora el pollo en la paellera con aceite.', 'Das Hähnchen in der Paellapfanne mit Öl anbraten.'],
      ['Añade las judías y después el tomate y el pimentón.', 'Bohnen dazugeben, danach Tomate und Paprikapulver.'],
      ['Echa el caldo y deja hervir 10 minutos.', 'Brühe angießen und 10 Minuten kochen lassen.'],
      ['Añade el arroz y el azafrán.', 'Reis und Safran dazugeben.'],
      ['Cocina 18 minutos sin remover.', '18 Minuten garen, dabei nicht umrühren.'],
      ['Deja reposar 5 minutos antes de comer.', 'Vor dem Essen 5 Minuten ruhen lassen.'],
    ],
    vocab: [['el arroz', 'der Reis'], ['el pollo', 'das Hähnchen'], ['hervir', 'kochen'], ['remover', 'umrühren']],
    fun: ['¡No se remueve!', 'Bei der Paella wird nicht umgerührt. Die knusprige Schicht am Pfannenboden heißt „socarrat“ – und ist das Beste.'],
  },
  pantomate: {
    name: 'Pan con tomate', city: 'barcelona', time: '10 Min', level: 'Leicht', base: 2, hot: false,
    sub: 'Geröstetes Brot mit Tomate – in Katalonien „pa amb tomàquet“',
    ingr: [['rebanadas de pan', 'Brotscheiben', 4, ''], ['tomates maduros', 'reife Tomaten', 2, ''], ['diente de ajo', 'Knoblauchzehe', 1, ''], ['aceite de oliva', 'Olivenöl', 2, ' EL'], ['sal', 'Salz', 1, ' Prise']],
    steps: [
      ['Tuesta el pan.', 'Das Brot rösten.'],
      ['Frota el pan con el ajo (si quieres).', 'Das Brot mit Knoblauch einreiben (wenn du magst).'],
      ['Corta el tomate y frótalo sobre el pan.', 'Die Tomate halbieren und auf dem Brot verreiben.'],
      ['Echa aceite y una pizca de sal.', 'Öl und eine Prise Salz darüber geben.'],
    ],
    vocab: [['tostar', 'rösten'], ['el ajo', 'der Knoblauch'], ['frotar', 'reiben'], ['una pizca', 'eine Prise']],
    fun: ['¿Desayuno?', 'In Katalonien isst man Pan con tomate zum Frühstück, Mittag- und Abendessen.'],
  },
  churros: {
    name: 'Churros con chocolate', city: 'pamplona', time: '40 Min', level: 'Mittel', base: 4, hot: true,
    sub: 'Belohnung für den Sieg über El Toro: Spritzgebäck mit heißer Schokolade',
    ingr: [['agua', 'Wasser', 250, ' ml'], ['harina', 'Mehl', 150, ' g'], ['sal', 'Salz', 1, ' Prise'], ['aceite para freír', 'Öl zum Frittieren', 500, ' ml'], ['azúcar', 'Zucker', 2, ' EL'], ['leche', 'Milch', 400, ' ml'], ['chocolate negro', 'Zartbitterschokolade', 200, ' g'], ['maicena', 'Speisestärke', 2, ' TL']],
    steps: [
      ['Hierve el agua con la sal.', 'Das Wasser mit dem Salz aufkochen.'],
      ['Añade la harina de golpe y mezcla bien.', 'Das Mehl auf einmal dazugeben und gut verrühren.'],
      ['Pon la masa en una manga pastelera.', 'Den Teig in einen Spritzbeutel füllen.'],
      ['Fríe tiras de masa en aceite caliente hasta que estén doradas.', 'Teigstreifen in heißem Öl goldbraun frittieren.'],
      ['Pásalas por azúcar.', 'In Zucker wälzen.'],
      ['Calienta la leche con el chocolate y la maicena hasta que espese.', 'Milch mit Schokolade und Stärke erhitzen, bis es dick wird.'],
    ],
    vocab: [['la masa', 'der Teig'], ['el azúcar', 'der Zucker'], ['la leche', 'die Milch'], ['dorado', 'goldbraun']],
    fun: ['¿Para desayunar?', 'Nach langen Festnächten frühstücken viele Spanier Churros mit Schokolade.'],
  },
};

// Kleidungsstücke für "Dein Spieler": [wert, name, farbe, ab Training]
export const OUTFIT = [
  { id: 'frisur', name: 'Frisur', opts: [['kurz', 'Kurz', '#2A1A14', 0], ['locken', 'Locken', '#2A1A14', 0], ['undercut', 'Undercut', '#2A1A14', 3], ['lang', 'Lang', '#2A1A14', 7]] },
  { id: 'haar', name: 'Haarfarbe', opts: [['#2A1A14', 'Schwarz', '#2A1A14', 0], ['#6B3E22', 'Braun', '#6B3E22', 0], ['#D9B25A', 'Blond', '#D9B25A', 4], ['#FA6D1E', 'Orange', '#FA6D1E', 9]] },
  { id: 'brille', name: 'Brille', opts: [['keine', 'Keine', 'none', 0], ['sonne', 'Sonnenbrille', '#020124', 6], ['sport', 'Sportbrille', '#FA6D1E', 9]] },
  { id: 'band', name: 'Stirnband', opts: [['keins', 'Keins', 'none', 0], ['#FA6D1E', 'Orange', '#FA6D1E', 2], ['#FFFFFF', 'Weiß', '#FFFFFF', 2], ['#C2185B', 'Carmesí', '#C2185B', 7]] },
  { id: 'trikot', name: 'Trikot', opts: [['basic', 'Basic', '#E4E7F5', 0], ['orange', 'España 10', '#FA6D1E', 1], ['carmesi', 'Carmesí', '#C2185B', 3], ['blanco', 'Blanco', '#FFFFFF', 4], ['streifen', 'Gestreift', '#0B1A6E', 8]] },
  { id: 'hose', name: 'Hose', opts: [['standard', 'Standard', '#3A4170', 0], ['navy', 'Noche', '#020124', 3], ['weiss', 'Weiß', '#E4E7F5', 5], ['carmesi', 'Carmesí', '#C2185B', 8]] },
  { id: 'schuhe', name: 'Schuhe', opts: [['keine', 'Nur Socken', '#C9CEE6', 0], ['orange', 'Orange', '#FA6D1E', 4], ['weiss', 'Weiß', '#FFFFFF', 4], ['schwarz', 'Schwarz', '#1A1A1A', 6]] },
  { id: 'extra', name: 'Extra', opts: [['nichts', 'Nichts', 'none', 0], ['ball', 'Volleyball', '#FFFFFF', 8], ['pokal', 'Pokal', '#E8A317', 12]] },
];

export const BADGES = [
  ['first', 'trophy', '1. Training'], ['racha5', 'flame', 'Racha 5'], ['racha10', 'flame', 'Racha 10'], ['combo10', 'check', 'Combo x10'],
  ['words50', 'cards', '50 Vokabeln'], ['words100', 'cards', '100 Vokabeln'], ['cleanbox', 'check', 'Fehlerkiste leer'], ['game1', 'pad', 'Erstes Spiel'],
  ['saque10', 'ball', 'Saque 10'], ['memo60', 'memory', 'Memoria < 60 s'], ['cook', 'pot', 'Cocinero'], ['boss', 'trophy', 'El Toro besiegt'],
];
