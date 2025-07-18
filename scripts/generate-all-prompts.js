#!/usr/bin/env node

/**
 * Script to generate all prompt images for all initial images
 * This helps you visualize exactly what each transformation will look like
 * for each base image, so you can tell us exactly what you like and how
 * you imagine the result should be.
 */

const fs = require('fs');
const path = require('path');

// Import the transformation types and inpaint images
const TRANSFORMATION_TYPES = [
  {
    id: 'library',
    name: 'Bibliothèque Moderne',
    description: 'Une bibliothèque contemporaine avec espaces de lecture et technologie',
    icon: '📚',
    prompt: 'Transform this church into a modern public library with bookshelves, reading areas, comfortable seating, natural lighting, and digital workstations. Maintain the architectural beauty while creating a welcoming space for learning and community gathering.',
    style: 'modern',
    category: 'culture'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Gastronomique',
    description: 'Un restaurant haut de gamme dans un cadre historique exceptionnel',
    icon: '🍽️',
    prompt: 'Transform this church into an elegant fine dining restaurant with sophisticated table settings, ambient lighting, a professional kitchen area, and wine displays. Preserve the grandeur while creating an intimate dining atmosphere.',
    style: 'realistic',
    category: 'business'
  },
  {
    id: 'coworking',
    name: 'Espace de Coworking',
    description: 'Un espace de travail collaboratif moderne et inspirant',
    icon: '💻',
    prompt: 'Transform this church into a modern coworking space with open work areas, private meeting rooms, comfortable lounge areas, and modern technology infrastructure. Blend historical architecture with contemporary workspace design.',
    style: 'modern',
    category: 'business'
  },
  {
    id: 'concert_hall',
    name: 'Salle de Concert',
    description: 'Une salle de spectacle acoustiquement parfaite',
    icon: '🎵',
    prompt: 'Transform this church into a concert hall with professional stage, audience seating, acoustic panels, and performance lighting. Enhance the natural acoustics while maintaining the architectural integrity.',
    style: 'artistic',
    category: 'culture'
  },
  {
    id: 'art_gallery',
    name: 'Galerie d\'Art',
    description: 'Un espace d\'exposition pour l\'art contemporain et classique',
    icon: '🎨',
    prompt: 'Transform this church into an art gallery with professional lighting, display walls, sculpture pedestals, and viewing areas. Create a sophisticated space that showcases artwork while respecting the historical architecture.',
    style: 'artistic',
    category: 'culture'
  },
  {
    id: 'community_center',
    name: 'Centre Communautaire',
    description: 'Un lieu de rassemblement pour la communauté locale',
    icon: '🏛️',
    prompt: 'Transform this church into a community center with flexible meeting spaces, activity areas, a small stage, and social gathering zones. Create a welcoming environment for community events and activities.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'wellness_spa',
    name: 'Centre de Bien-être',
    description: 'Un spa luxueux pour la détente et le ressourcement',
    icon: '🧘',
    prompt: 'Transform this church into a wellness spa with meditation areas, treatment rooms, relaxation pools, and zen gardens. Create a peaceful, healing environment that promotes tranquility and well-being.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'innovation_lab',
    name: 'Laboratoire d\'Innovation',
    description: 'Un espace high-tech pour la recherche et l\'innovation',
    icon: '🔬',
    prompt: 'Transform this church into a high-tech innovation laboratory with modern equipment, research stations, collaborative spaces, and digital displays. Blend cutting-edge technology with the historical architecture.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'market_hall',
    name: 'Marché Couvert',
    description: 'Un marché artisanal et gastronomique local',
    icon: '🛒',
    prompt: 'Transform this church into a covered market with artisanal food stalls, local produce vendors, seating areas, and a central gathering space. Create a vibrant marketplace that celebrates local culture and cuisine.',
    style: 'realistic',
    category: 'community'
  },
  {
    id: 'gaming_arena',
    name: 'Arène Gaming',
    description: 'Un espace gaming et e-sport de nouvelle génération',
    icon: '🎮',
    prompt: 'Transform this church into a modern gaming arena with high-end gaming stations, tournament seating, streaming equipment, and LED lighting. Create an exciting esports venue while maintaining architectural respect.',
    style: 'creative',
    category: 'innovation'
  },
  // NEW CUTTING-EDGE TRANSFORMATIONS
  {
    id: 'biophilic_sanctuary',
    name: 'Sanctuaire Biophilique',
    description: 'Un espace de reconnexion avec la nature intégrant végétation et architecture',
    icon: '🌿',
    prompt: 'Transform this church into a cutting-edge biophilic sanctuary with living walls, suspended gardens, natural water features, and organic architectural elements. Integrate advanced hydroponic systems, climate-controlled micro-ecosystems, and biomimetic design patterns that blur the boundaries between interior and nature.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'holographic_museum',
    name: 'Musée Holographique',
    description: 'Un musée immersif utilisant la réalité augmentée et les hologrammes',
    icon: '🔮',
    prompt: 'Transform this church into a futuristic holographic museum with transparent OLED displays, volumetric projection systems, interactive AR installations, and floating holographic exhibits. Feature sleek minimalist design with hidden technology infrastructure and dynamic lighting that responds to visitor presence.',
    style: 'creative',
    category: 'culture'
  },
  {
    id: 'vertical_farm',
    name: 'Ferme Verticale Urbaine',
    description: 'Une ferme verticale high-tech pour l\'agriculture urbaine durable',
    icon: '🌱',
    prompt: 'Transform this church into a revolutionary vertical farm with multi-story growing towers, automated hydroponic systems, LED grow lights, robotic harvesting systems, and transparent growing chambers. Integrate sustainable technology with Gothic architecture, featuring glass cultivation pods and climate-controlled growing environments.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'quantum_research',
    name: 'Centre de Recherche Quantique',
    description: 'Un laboratoire de recherche quantique avec équipements de pointe',
    icon: '⚛️',
    prompt: 'Transform this church into a quantum research facility with cryogenic chambers, quantum computers, electromagnetic isolation chambers, and advanced scientific equipment. Feature ultra-modern clean room environments, particle accelerator components, and holographic data visualization systems within the preserved Gothic structure.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'metamorphic_theater',
    name: 'Théâtre Métamorphique',
    description: 'Un théâtre avec scène transformable et architecture adaptative',
    icon: '🎭',
    prompt: 'Transform this church into a metamorphic theater with shape-shifting stage configurations, moveable architectural elements, dynamic acoustic panels, and programmable lighting systems. Feature retractable seating, modular performance spaces, and kinetic architectural components that can reconfigure for different types of performances.',
    style: 'creative',
    category: 'culture'
  },
  {
    id: 'neural_interface_lab',
    name: 'Laboratoire d\'Interface Neuronale',
    description: 'Un centre de recherche sur les interfaces cerveau-machine',
    icon: '🧠',
    prompt: 'Transform this church into a neural interface research laboratory with brain-computer interface stations, neural mapping equipment, meditation chambers with EEG monitoring, and consciousness research facilities. Integrate cutting-edge neurotechnology with serene, contemplative spaces that honor the spiritual heritage.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'crystalline_conservatory',
    name: 'Conservatoire Cristallin',
    description: 'Un conservatoire de musique avec acoustique cristalline révolutionnaire',
    icon: '💎',
    prompt: 'Transform this church into a crystalline conservatory with geometric crystal-inspired architecture, resonant crystal formations for natural acoustics, prismatic light diffusion systems, and mineral-based sound chambers. Feature crystalline performance pods, geode-inspired practice rooms, and harmonic crystal installations.',
    style: 'artistic',
    category: 'culture'
  },
  {
    id: 'atmospheric_processor',
    name: 'Processeur Atmosphérique',
    description: 'Une installation de purification d\'air et de régénération atmosphérique',
    icon: '🌪️',
    prompt: 'Transform this church into an atmospheric processing facility with massive air purification systems, atmospheric regeneration chambers, wind tunnel testing areas, and climate simulation environments. Feature towering filtration columns, atmospheric monitoring stations, and weather generation systems integrated into the Gothic architecture.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'temporal_archive',
    name: 'Archive Temporelle',
    description: 'Un centre de préservation numérique avec technologie de stockage quantique',
    icon: '⏳',
    prompt: 'Transform this church into a temporal archive with quantum storage systems, holographic data preservation chambers, time-locked vaults, and digital eternity installations. Feature crystalline data storage matrices, temporal visualization displays, and preservation pods that maintain digital heritage for millennia.',
    style: 'creative',
    category: 'culture'
  },
  {
    id: 'symbiotic_habitat',
    name: 'Habitat Symbiotique',
    description: 'Un écosystème vivant où humains et nature coexistent harmonieusement',
    icon: '🦋',
    prompt: 'Transform this church into a symbiotic habitat with living architecture, bio-responsive materials, symbiotic organism cultivation, and human-nature integration systems. Feature breathing walls, organic growth chambers, bio-luminescent lighting, and spaces where the boundary between built environment and living ecosystem dissolves completely.',
    style: 'modern',
    category: 'innovation'
  }
];

const INPAINT_IMAGES = [
  {
    path: "/images/46075-this-building-is-classe-au-titre-des-monuments-historiques-de-la-france-it-is-indexed-in-the-base-merimee-a-database-of-architectural-heritage-maintained-by-the-french.jpg",
    name: "Saint-Gildas Extérieur",
    description: "Vue extérieure de l'église Saint-Gildas - Façade principale",
    maskPath: "/images/inpaint/total/inpaint1.jpg",
    type: "exterior",
    hdPainterMethod: "painta+rasg",
    resolution: "hd",
  },
  {
    path: "/images/184232-english-inside-church-saint-gildas-in-auray-france.jpg",
    name: "Saint-Gildas Intérieur",
    description: "Vue intérieure de l'église Saint-Gildas - Nef principale",
    maskPath: "/images/inpaint/total/184232-english-inside-church-saint-gildas-in-auray-franceINPAINT.jpg",
    type: "interior",
    hdPainterMethod: "painta+rasg",
    resolution: "hd",
  },
  {
    path: "/images/20220922_143843.jpg",
    name: "Vue Détaillée Architecture",
    description: "Vue détaillée de l'architecture - Éléments décoratifs",
    maskPath: "/images/inpaint/total/inpaint2.jpg",
    type: "detail",
    hdPainterMethod: "rasg",
    resolution: "ultra",
  },
  {
    path: "/images/fra-auray-4-1882354559.jpg",
    name: "Vue Alternative",
    description: "Perspective alternative de l'église - Angle latéral",
    maskPath: "/images/inpaint/total/inpaint3.jpg",
    type: "alternative",
    hdPainterMethod: "painta+rasg",
    resolution: "hd",
  }
];

// Enhanced prompt generation function
function generateEnhancedPrompt(transformationType, basePrompt, baseImageName = "Saint-Gildas-Auray-768x576.webp") {
  const isInterior = baseImageName.toLowerCase().includes("interieur") || 
                    baseImageName.toLowerCase().includes("inside");

  const transformationNames = {
    library: "modern library",
    restaurant: "fine dining restaurant",
    coworking: "modern coworking space",
    concert_hall: "concert hall",
    art_gallery: "art gallery",
    community_center: "community center",
    wellness_spa: "wellness spa",
    innovation_lab: "innovation laboratory",
    market_hall: "market hall",
    gaming_arena: "gaming arena",
    biophilic_sanctuary: "biophilic sanctuary",
    holographic_museum: "holographic museum",
    vertical_farm: "vertical farm",
    quantum_research: "quantum research facility",
    metamorphic_theater: "metamorphic theater",
    neural_interface_lab: "neural interface laboratory",
    crystalline_conservatory: "crystalline conservatory",
    atmospheric_processor: "atmospheric processor",
    temporal_archive: "temporal archive",
    symbiotic_habitat: "symbiotic habitat",
  };

  // Base prompt with mandatory requirements
  let prompt = `
Transform this church into ${transformationNames[transformationType] || "a transformed space"} that blends modern functionality with historical architecture.

ARCHITECTURE: Preserve stone arches, vaulted ceilings, stained glass, and Gothic proportions while integrating modern elements.

DESIGN: `;

  // Add transformation-specific design elements
  const designElements = {
    library: "Glass-walled study areas with smart glass technology, floating bookshelves suspended by invisible cables, holographic reading interfaces, and AI-powered knowledge discovery pods that seamlessly blend with Gothic arches.",
    restaurant: "Levitating dining platforms, molecular gastronomy stations, interactive table surfaces with embedded displays, and atmospheric lighting that responds to the flavors being served, all within preserved stone walls.",
    coworking: "Modular workspace pods that reconfigure automatically, wireless power transmission zones, holographic collaboration spaces, and biometric-responsive environments that adapt to user productivity patterns.",
    concert_hall: "Metamorphic acoustic shells that reshape for optimal sound, levitating stage platforms, 360-degree immersive audio systems, and audience seating that moves in harmony with the music's rhythm.",
    art_gallery: "Gravity-defying display systems, programmable matter sculptures, neural-responsive lighting that adapts to viewer emotions, and augmented reality layers that reveal hidden artistic dimensions.",
    community_center: "Shape-shifting multipurpose spaces, community memory walls with interactive historical displays, empathy-enhancing communication pods, and social harmony algorithms that optimize group interactions.",
    wellness_spa: "Levitating meditation chambers, chromotherapy pools with programmable water molecules, bio-resonance healing pods, and atmospheric processors that generate personalized healing environments.",
    innovation_lab: "Quantum computing clusters housed in crystal formations, matter manipulation chambers, time-dilated research pods, and consciousness-expansion interfaces integrated within sacred geometry.",
    market_hall: "Floating vendor stalls with gravity-defying product displays, flavor-transmission technology, cultural exchange pods, and community abundance algorithms that ensure equitable resource distribution.",
    gaming_arena: "Neural-interface gaming pods, holographic battle arenas, consciousness-merging multiplayer systems, and spectator empathy chambers that allow audiences to experience gameplay emotions.",
    biophilic_sanctuary: "Living architectural elements that grow and adapt, symbiotic human-plant interfaces, atmospheric oxygen generation systems, and bio-luminescent pathways that respond to natural circadian rhythms.",
    holographic_museum: "Temporal exhibition chambers displaying past and future simultaneously, consciousness-recording devices for experiential history, quantum artifact preservation fields, and visitor memory integration systems.",
    vertical_farm: "Multi-dimensional growing matrices defying traditional space constraints, plant-consciousness communication networks, automated nutrient optimization systems, and harvest-to-table teleportation pods.",
    quantum_research: "Reality manipulation chambers, parallel universe observation decks, quantum entanglement communication arrays, and consciousness-quantum field interface laboratories within sacred stone walls.",
    metamorphic_theater: "Reality-bending performance spaces, audience-actor consciousness merging systems, temporal narrative loops, and emotional resonance amplification chambers that transform spectators into participants.",
    neural_interface_lab: "Consciousness expansion chambers, thought-to-reality manifestation pods, collective intelligence networks, and spiritual-technological synthesis laboratories honoring the sacred space's heritage.",
    crystalline_conservatory: "Resonant crystal formations that generate music from architectural vibrations, harmonic healing chambers, sound-to-light conversion systems, and acoustic levitation performance spaces.",
    atmospheric_processor: "Planetary-scale air purification systems, weather generation chambers, atmospheric composition laboratories, and climate harmony restoration pods integrated into Gothic structural elements.",
    temporal_archive: "Time-locked preservation chambers, quantum memory storage crystals, historical consciousness recording systems, and eternal knowledge preservation pods that transcend temporal limitations.",
    symbiotic_habitat: "Human-nature consciousness merger zones, bio-architectural growth systems, interspecies communication networks, and evolutionary acceleration chambers where beings and environment co-evolve harmoniously.",
  };

  prompt += designElements[transformationType] || "Contemporary design elements that respect and enhance the historical architecture.";

  // Add lighting and atmosphere
  prompt += `

LIGHTING: Natural light through stained glass with warm artificial lighting highlighting both old and new elements.

QUALITY: Photorealistic, 8K, professional lighting, detailed textures, vibrant colors, sharp focus.`;

  return prompt;
}

// Generate all combinations
function generateAllPrompts() {
  console.log('🎨 CHURCH TRANSFORMATION - ALL PROMPT COMBINATIONS');
  console.log('=' .repeat(80));
  console.log('');
  console.log('This script generates all possible combinations of transformations and base images.');
  console.log('Use this to tell us exactly what you like and how you imagine the result should be.');
  console.log('');

  const results = [];

  INPAINT_IMAGES.forEach((image, imageIndex) => {
    console.log(`\n📸 BASE IMAGE ${imageIndex + 1}: ${image.name}`);
    console.log(`   Path: ${image.path}`);
    console.log(`   Type: ${image.type} | Method: ${image.hdPainterMethod} | Resolution: ${image.resolution}`);
    console.log(`   Description: ${image.description}`);
    console.log('   ' + '-'.repeat(70));

    TRANSFORMATION_TYPES.forEach((transformation, transformIndex) => {
      const baseImageName = image.path.split('/').pop() || 'Saint-Gildas-Auray-768x576.webp';
      const enhancedPrompt = generateEnhancedPrompt(transformation.id, transformation.prompt, baseImageName);
      
      const combination = {
        imageIndex: imageIndex + 1,
        imageName: image.name,
        imagePath: image.path,
        maskPath: image.maskPath,
        imageType: image.type,
        hdPainterMethod: image.hdPainterMethod,
        resolution: image.resolution,
        transformationIndex: transformIndex + 1,
        transformationId: transformation.id,
        transformationName: transformation.name,
        transformationIcon: transformation.icon,
        transformationDescription: transformation.description,
        transformationStyle: transformation.style,
        transformationCategory: transformation.category,
        basePrompt: transformation.prompt,
        enhancedPrompt: enhancedPrompt,
        combinationId: `${image.name.replace(/\s+/g, '_')}_${transformation.id}`
      };

      results.push(combination);

      console.log(`   ${(transformIndex + 1).toString().padStart(2)}. ${transformation.icon} ${transformation.name}`);
      console.log(`      Category: ${transformation.category} | Style: ${transformation.style}`);
      console.log(`      Description: ${transformation.description}`);
      console.log(`      Combination ID: ${combination.combinationId}`);
      console.log('');
    });
  });

  // Save results to JSON file
  const outputPath = path.join(__dirname, 'all-prompt-combinations.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(80));
  console.log(`✅ Generated ${results.length} prompt combinations!`);
  console.log(`📁 Results saved to: ${outputPath}`);
  console.log('');
  console.log('🎯 HOW TO USE THIS:');
  console.log('1. Review the combinations above');
  console.log('2. Tell us which image + transformation combinations you like most');
  console.log('3. Describe exactly how you imagine the result should look');
  console.log('4. We\'ll refine the prompts to match your vision perfectly!');
  console.log('');
  console.log('💡 TIP: Focus on combinations that excite you the most!');
  console.log('');

  return results;
}

// Generate CSV for easy review
function generateCSV(results) {
  const csvPath = path.join(__dirname, 'all-prompt-combinations.csv');
  const headers = [
    'Image Index',
    'Image Name',
    'Image Type',
    'HD Painter Method',
    'Resolution',
    'Transformation Index',
    'Transformation ID',
    'Transformation Name',
    'Transformation Icon',
    'Category',
    'Style',
    'Combination ID',
    'Enhanced Prompt'
  ];
  
  let csvContent = headers.join(',') + '\n';
  
  results.forEach(result => {
    const row = [
      result.imageIndex,
      `"${result.imageName}"`,
      result.imageType,
      result.hdPainterMethod,
      result.resolution,
      result.transformationIndex,
      result.transformationId,
      `"${result.transformationName}"`,
      result.transformationIcon,
      result.transformationCategory,
      result.transformationStyle,
      result.combinationId,
      `"${result.enhancedPrompt.replace(/"/g, '""')}"`
    ];
    csvContent += row.join(',') + '\n';
  });
  
  fs.writeFileSync(csvPath, csvContent);
  console.log(`📊 CSV export saved to: ${csvPath}`);
}

// Generate HTML preview
function generateHTMLPreview(results) {
  const htmlPath = path.join(__dirname, 'prompt-preview.html');
  
  let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Church Transformation - All Prompt Combinations</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .image-section { background: white; margin: 20px 0; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .image-header { border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
        .transformation-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .transformation-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #fafafa; }
        .transformation-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .transformation-icon { font-size: 24px; }
        .transformation-name { font-weight: bold; color: #333; }
        .transformation-meta { font-size: 12px; color: #666; margin-bottom: 10px; }
        .prompt-preview { font-size: 11px; color: #555; background: #f0f0f0; padding: 10px; border-radius: 5px; max-height: 100px; overflow-y: auto; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; }
        .badge-culture { background: #e3f2fd; color: #1976d2; }
        .badge-business { background: #f3e5f5; color: #7b1fa2; }
        .badge-community { background: #e8f5e8; color: #388e3c; }
        .badge-innovation { background: #fff3e0; color: #f57c00; }
        .badge-modern { background: #e1f5fe; color: #0277bd; }
        .badge-artistic { background: #fce4ec; color: #c2185b; }
        .badge-realistic { background: #f1f8e9; color: #689f38; }
        .badge-creative { background: #fff8e1; color: #ffa000; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Church Transformation - All Prompt Combinations</h1>
            <p>Review all ${results.length} combinations and tell us exactly what you like!</p>
        </div>
`;

  // Group by image
  const imageGroups = {};
  results.forEach(result => {
    if (!imageGroups[result.imageName]) {
      imageGroups[result.imageName] = [];
    }
    imageGroups[result.imageName].push(result);
  });

  Object.entries(imageGroups).forEach(([imageName, combinations]) => {
    const firstCombination = combinations[0];
    html += `
        <div class="image-section">
            <div class="image-header">
                <h2>📸 ${imageName}</h2>
                <p><strong>Type:</strong> ${firstCombination.imageType} | <strong>Method:</strong> ${firstCombination.hdPainterMethod} | <strong>Resolution:</strong> ${firstCombination.resolution}</p>
                <p><em>${firstCombination.imagePath}</em></p>
            </div>
            <div class="transformation-grid">
`;

    combinations.forEach(combination => {
      html += `
                <div class="transformation-card">
                    <div class="transformation-header">
                        <span class="transformation-icon">${combination.transformationIcon}</span>
                        <span class="transformation-name">${combination.transformationName}</span>
                    </div>
                    <div class="transformation-meta">
                        <span class="badge badge-${combination.transformationCategory}">${combination.transformationCategory}</span>
                        <span class="badge badge-${combination.transformationStyle}">${combination.transformationStyle}</span>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-bottom: 10px;">${combination.transformationDescription}</p>
                    <div class="prompt-preview">${combination.enhancedPrompt.substring(0, 200)}...</div>
                    <p style="font-size: 10px; color: #999; margin-top: 5px;"><strong>ID:</strong> ${combination.combinationId}</p>
                </div>
`;
    });

    html += `
            </div>
        </div>
`;
  });

  html += `
    </div>
</body>
</html>
`;

  fs.writeFileSync(htmlPath, html);
  console.log(`🌐 HTML preview saved to: ${htmlPath}`);
}

// Main execution
if (require.main === module) {
  console.log('🚀 Starting prompt generation...\n');
  
  const results = generateAllPrompts();
  generateCSV(results);
  generateHTMLPreview(results);
  
  console.log('\n🎉 All files generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Open prompt-preview.html in your browser');
  console.log('2. Review the combinations');
  console.log('3. Tell us your favorites and how you imagine them!');
}

module.exports = { generateAllPrompts, generateEnhancedPrompt };