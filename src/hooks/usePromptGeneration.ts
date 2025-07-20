import { useCallback } from "react";
import { TransformationType } from "@/lib/types";

export const usePromptGeneration = () => {
  const generateEnhancedPrompt = useCallback(
    (transformationType: string, basePrompt: string, baseImageName: string = "Saint-Gildas-Auray-768x576.webp"): string => {
      const isInterior = baseImageName.toLowerCase().includes("interieur") || baseImageName.toLowerCase().includes("inside");
      
      const transformationNames: Record<string, string> = {
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
        climbing: "climbing center",
        swimming_pool: "aquatic center",
        sauna_hammam: "sauna hammam spa",
        indoor_skydiving: "indoor skydiving facility",
        trampoline_park: "trampoline park",
        laser_game: "laser tag arena",
        playground: "indoor playground",
        third_place: "community third place",
        fablab: "fabrication laboratory",
        ice_rink: "ice rink",
        cat_cuddling: "cat cuddling café",
      };

      const designElements: Record<string, string> = {
       library:
          "Glass-walled study areas with smart glass technology, floating bookshelves suspended by invisible cables, holographic reading interfaces, and AI-powered knowledge discovery pods that seamlessly blend with Gothic arches.",
        restaurant:
          "Levitating dining platforms, molecular gastronomy stations, interactive table surfaces with embedded displays, and atmospheric lighting that responds to the flavors being served, all within preserved stone walls.",
        coworking:
          "Modular workspace pods that reconfigure automatically, wireless power transmission zones, holographic collaboration spaces, and biometric-responsive environments that adapt to user productivity patterns.",
        concert_hall:
          "Metamorphic acoustic shells that reshape for optimal sound, levitating stage platforms, 360-degree immersive audio systems, and audience seating that moves in harmony with the music's rhythm.",
        art_gallery:
          "Gravity-defying display systems, programmable matter sculptures, neural-responsive lighting that adapts to viewer emotions, and augmented reality layers that reveal hidden artistic dimensions.",
        community_center:
          "Shape-shifting multipurpose spaces, community memory walls with interactive  displays, empathy-enhancing communication pods, and social harmony algorithms that optimize group interactions.",
        wellness_spa:
          "Levitating meditation chambers, chromotherapy pools with programmable water molecules, bio-resonance healing pods, and atmospheric processors that generate personalized healing environments.",
        innovation_lab:
          "Quantum computing clusters housed in crystal formations, matter manipulation chambers, time-dilated research pods, and consciousness-expansion interfaces integrated within sacred geometry.",
        market_hall:
          "Floating vendor stalls with gravity-defying product displays, flavor-transmission technology, cultural exchange pods, and community abundance algorithms that ensure equitable resource distribution.",
        gaming_arena:
          "Neural-interface gaming pods, holographic battle arenas, consciousness-merging multiplayer systems, and spectator empathy chambers that allow audiences to experience gameplay emotions.",
        biophilic_sanctuary:
          "Living architectural elements that grow and adapt, symbiotic human-plant interfaces, atmospheric oxygen generation systems, and bio-luminescent pathways that respond to natural circadian rhythms.",
        holographic_museum:
          "Temporal exhibition chambers displaying past and future simultaneously, consciousness-recording devices for experiential history, quantum artifact preservation fields, and visitor memory integration systems.",
        vertical_farm:
          "Multi-dimensional growing matrices defying traditional space constraints, plant-consciousness communication networks, automated nutrient optimization systems, and harvest-to-table teleportation pods.",
        quantum_research:
          "Reality manipulation chambers, parallel universe observation decks, quantum entanglement communication arrays, and consciousness-quantum field interface laboratories within sacred stone walls.",
        metamorphic_theater:
          "Reality-bending performance spaces, audience-actor consciousness merging systems, temporal narrative loops, and emotional resonance amplification chambers that transform spectators into participants.",
        neural_interface_lab:
          "Consciousness expansion chambers, thought-to-reality manifestation pods, collective intelligence networks, and spiritual-technological synthesis laboratories honoring the sacred space's heritage.",
        crystalline_conservatory:
          "Resonant crystal formations that generate music from architectural vibrations, harmonic healing chambers, sound-to-light conversion systems, and acoustic levitation performance spaces.",
        atmospheric_processor:
          "Planetary-scale air purification systems, weather generation chambers, atmospheric composition laboratories, and climate harmony restoration pods integrated into Gothic structural elements.",
        temporal_archive:
          "Time-locked preservation chambers, quantum memory storage crystals,  consciousness recording systems, and eternal knowledge preservation pods that transcend temporal limitations.",
        symbiotic_habitat:
          "Human-nature consciousness merger zones, bio-architectural growth systems, interspecies communication networks, and evolutionary acceleration chambers where beings and environment co-evolve harmoniously.",

      };

      let prompt = `Transform this into ${transformationNames[transformationType] || "a transformed space"}.

DESIGN: `;
      
      prompt += designElements[transformationType] || "Contemporary design elements that respect and enhance the architecture.";
      
      return prompt.trim();
    },
    []
  );

  return { generateEnhancedPrompt };
};