/* ============================================
   THE LIGHTHOUSE - RADIAL TIMELINE VISUALIZATION
   Based on the HowToTalkToAnyone visualization style
   ============================================ */

console.log('The Lighthouse - Radial Timeline v1.0 loaded');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Act colors - more distinct palette
    ACT_COLORS: {
        'act1': '#2d7a4d',  // Green - Arrival & Tension
        'act2': '#7a5aa0',  // Brighter Purple - The Storm
        'act3': '#c44536'   // Brighter Red - Madness & Reckoning
    },

    // Scene type colors
    TYPE_COLORS: {
        'hallucination': '#b8860b',
        'violence': '#8b0000',
        'revelation': '#1a5a7a',
        'mythology': '#5E35B1',
        'conflict': '#E53935',
        'bonding': '#43A047',
        'labor': '#6D4C41',
        'horror': '#D81B60'
    },

    // Act icons
    ACT_ICONS: {
        'act1': '🚢',
        'act2': '⛈️',
        'act3': '🔥'
    },

    // Act full names
    ACT_NAMES: {
        'act1': 'Act I: Arrival & Tension (Week 1-2)',
        'act2': 'Act II: The Storm (Week 2-3)',
        'act3': 'Act III: Madness & Reckoning (Week 4+)'
    },

    // Layout dimensions
    DIAMETER: 900,
    STORAGE_KEY: 'lighthouse-viewed-scenes'
};

// ============================================
// SCENE DATA
// ============================================

const SCENES = [
    // ACT I - ARRIVAL & TENSION
    { id: 1, act: 'act1', title: 'Arrival on Pilot Rock', types: ['establishing', 'atmosphere'],
      location: 'EXT. Atlantic Ocean / Pilot Rock',
      time: 'Day 1 - Sunset',
      summary: 'Young and Old arrive on a lighthouse tender through thick fog. The crumbling lighthouse tower looms over Pilot Rock, surrounded by screeching seagulls. The departing keepers shuffle past without a word—a grim warning. The foghorn bellows, shaking Young to his core. Old is unfazed; he\'s home.',
      symbols: ['foghorn', 'seagulls', 'lighthouse', 'fog'],
      quotes: [],
      characters: { young: 'Fearful, uncertain', old: 'Comfortable, at home' },
      imagery: 'Fog swallows the tender. Shadows that might be men or ghosts. Seagulls screeching around the crumbling tower.',
      themes: ['isolation', 'entrapment', 'fate'],
      tension: 3,
      mythologyRef: 'Charon ferrying souls to the underworld',
      callbacks: [], foreshadowing: [5, 12, 41] },

    { id: 2, act: 'act1', title: 'First Night - Exploration', types: ['character', 'mystery'],
      location: 'INT. Living Quarters',
      time: 'Day 1 - Evening',
      summary: 'Young explores the run-down quarters—coal range, farmhouse sink, rattling stove. He spots a locked roll-top desk with a ship-in-a-bottle. Upstairs, Old pisses into his chamber pot, then farts directly in Young\'s face—a deliberate display of dominance. Young discovers an ivory MERMAID CARVING hidden in his mattress, rubbing it with hungry curiosity.',
      symbols: ['mermaid carving', 'locked desk', 'chamber pot'],
      quotes: [],
      characters: { young: 'Curious, suppressed desire', old: 'Dominant, crude, territorial' },
      imagery: 'Warped mildewed floorboards. Clock ticking monotonously. Ivory mermaid with scrimshawed scales.',
      themes: ['power dynamics', 'sexuality', 'secrets'],
      tension: 4,
      mythologyRef: 'Siren mythology introduced via carving',
      callbacks: [], foreshadowing: [8, 22, 35] },

    { id: 3, act: 'act1', title: 'The Foghorn & Furnace', types: ['labor', 'atmosphere'],
      location: 'INT. Fog Signal House',
      time: 'Day 1 - Night',
      summary: 'The steam-powered foghorn engine pumps and whirs. Young shovels coal into the hungry furnace, dripping with sweat, wincing from the heat. The fog siren blows EXCRUCIATINGLY LOUDLY—he reels from the pain. Meanwhile, Old crawls into a cabinet and emerges with a hidden crate of homemade liquor, tremoring with need.',
      symbols: ['foghorn', 'fire', 'coal', 'liquor'],
      quotes: [],
      characters: { young: 'Suffering, laboring', old: 'Alcoholic need, secretive' },
      imagery: 'Piston pumping, gears grinding, flywheel spinning. Mouth of hungry furnace glowing with fire.',
      themes: ['labor exploitation', 'addiction', 'hellfire'],
      tension: 5,
      mythologyRef: 'Sisyphean labor; hellish furnace',
      callbacks: [], foreshadowing: [27] },

    { id: 4, act: 'act1', title: 'The First Supper', types: ['conflict', 'power'],
      location: 'INT. Galley',
      time: 'Day 1 - Night',
      summary: 'Old recites his prayer: "Should pale death with treble dread make the ocean caves our bed..." He pours thick homemade grog and offers Young a toast. Young refuses—he\'s read it\'s against regulations. He pours out the liquor and drinks cistern water instead. It tastes TERRIBLE. Old assigns menial duties: polishing, swabbing, fixing. "The light\'s mine."',
      symbols: ['toast/prayer', 'the light', 'cistern', 'regulations'],
      quotes: ['"Should pale death with treble dread make the ocean caves our bed..."', '"The light\'s mine."'],
      characters: { young: 'Defiant, rule-following', old: 'Testing, asserting dominance' },
      imagery: 'Lukewarm scrod and potatoes. Kerosene lamp bent to one side. Coal-blackened hands staining paper.',
      themes: ['authority vs rebellion', 'ritual', 'forbidden knowledge'],
      tension: 6,
      mythologyRef: 'Prayer echoes maritime superstition',
      callbacks: [], foreshadowing: [12, 32] },

    { id: 5, act: 'act1', title: 'Old Alone with the Light', types: ['mystery', 'obsession'],
      location: 'INT. Lantern Room',
      time: 'Day 1 - Night',
      summary: 'Old sits mesmerized by the massive FRESNEL LENS, sweating profusely. The heat is immense. He strips to bare-chested, revealing faded ship tattoos glistening with sweat. He pours grog, toasts the light like a lover: "To ye, me beauty!" His eyes are heavy with devotion. The lens rotates hypnotically, casting otherworldly patterns.',
      symbols: ['the light', 'fresnel lens', 'obsession', 'tattoos'],
      quotes: ['"To ye, me beauty!"'],
      characters: { young: 'Absent', old: 'Worshipful, intimate with the light' },
      imagery: 'Third-order Fresnel lens. Swirling light patterns through ironwork. Faded three-masted ship tattoo.',
      themes: ['idolatry', 'forbidden love', 'transcendence'],
      tension: 5,
      mythologyRef: 'Light as divine/erotic object; Promethean fire',
      callbacks: [], foreshadowing: [11, 39, 40] },

    { id: 6, act: 'act1', title: 'First Vision - Log Drive', types: ['hallucination', 'foreshadowing'],
      location: 'EXT. Shore / INT. Bunkroom',
      time: 'Day 1 - Night',
      summary: 'Young is drawn hypnotically toward the water, wading deeper despite himself. Suddenly, LOGS float toward him—a river log drive. A BODY floats face-down: a man in a wool mackinaw coat and hobnailed boots. A CANT HOOK (logging tool) floats nearby. The logs jam. A MERMAID swims menacingly toward him underwater. He wakes with water dripping on his face.',
      symbols: ['logs', 'drowning man', 'mermaid', 'cant hook', 'mackinaw coat'],
      quotes: [],
      characters: { young: 'Hypnotized, guilty, terrified', old: 'Absent' },
      imagery: 'Sea full of logs. Body in mackinaw coat. Mermaid swimming menacingly underwater.',
      themes: ['guilt', 'repressed memory', 'water as subconscious'],
      tension: 7,
      mythologyRef: 'Sirens luring sailors; guilt manifesting as vision',
      callbacks: [], foreshadowing: [29, 33], isHallucination: true },

    { id: 7, act: 'act1', title: 'Monotonous Labor', types: ['labor', 'montage'],
      location: 'EXT. Pilot Rock - Various',
      time: 'Days 2-7',
      summary: 'Endless grueling work: cleaning the putrid cistern (full of mold and sludge), scraping rotted shingles, hauling coal in a squeaking wheelbarrow, lugging massive oil drums up the tower. Young sees Old humping his mattress in his sleep. The ONE-EYED GULL appears for the first time, blocking his path with its gruesome empty socket—a war wound.',
      symbols: ['wheelbarrow', 'one-eyed gull', 'cistern', 'labor'],
      quotes: [],
      characters: { young: 'Exhausted, observant', old: 'Unconsciously sexual, degraded' },
      imagery: 'Cistern full of mold and frothy sludge. Squeaking wheelbarrow. Gull with gruesome empty socket.',
      themes: ['drudgery', 'voyeurism', 'omen'],
      tension: 4,
      mythologyRef: 'One-eyed gull as Odin\'s ravens or fate',
      callbacks: [], foreshadowing: [12, 17] },

    { id: 8, act: 'act1', title: 'Young Watches Old', types: ['voyeurism', 'mystery'],
      location: 'EXT. Supply Shed / Tower',
      time: 'Night',
      summary: 'Young masturbates in the supply shed, holding the mermaid carving. Afterward, smoking, he notices the lighthouse beams have a MAN\'S SILHOUETTE within them. Looking up: is Old EMBRACING the lens? Later, Old appears on the catwalk, pulling on suspenders as if dressing after intimacy. Young hides in the shadows, watching.',
      symbols: ['mermaid carving', 'the light', 'voyeurism', 'silhouette'],
      quotes: [],
      characters: { young: 'Secretive, aroused, suspicious', old: 'Post-coital with the light' },
      imagery: 'Dark spot in center of light. Man\'s silhouette in rotating beams. Old pulling on suspenders.',
      themes: ['sexuality', 'forbidden knowledge', 'jealousy'],
      tension: 6,
      mythologyRef: 'Peeping Tom; voyeurism as sin',
      callbacks: [5], foreshadowing: [11, 27] },

    { id: 9, act: 'act1', title: 'Swab, Dog!', types: ['conflict', 'power'],
      location: 'INT. Galley',
      time: 'Week 2',
      summary: 'Old points at the floor in horror—it looks the same as always. He accuses Young of neglecting duties. Young protests he mopped twice. Old erupts: "If I tells ye to yank out every nail and suck off every spec of rust... you\'ll do it! And you\'ll like it \'cause I says you will!" Young is forced to submit. Old sings mockingly: "\'Tis Brasswork."',
      symbols: ['power', 'dog', 'obedience', 'brasswork'],
      quotes: ['"If I tells ye to yank out every nail and suck off every spec of rust... you\'ll do it!"', '"\'Tis Brasswork"'],
      characters: { young: 'Humiliated, submissive', old: 'Tyrannical, sadistic' },
      imagery: 'Old pointing at floor in horror. Young mopping. Old singing mockingly.',
      themes: ['power abuse', 'dehumanization', 'master-slave'],
      tension: 7,
      mythologyRef: 'Calling him "dog" - dehumanization',
      callbacks: [4], foreshadowing: [36] },

    { id: 10, act: 'act1', title: 'Whitewashing the Tower', types: ['danger', 'labor'],
      location: 'EXT. Lighthouse Tower',
      time: 'Week 2',
      summary: 'Young hangs 50 feet up on a rickety chair attached to a broken pulley, whitewashing the tower while wind nearly knocks him off. Old controls the rope from above, taunting him. The pulley\'s wheel FLIES OFF—Young plummets to the ground. He wakes covered in whitewash. The one-eyed gull pecks at his leg, scavenging fresh meat.',
      symbols: ['one-eyed gull', 'fall', 'tower', 'whitewash'],
      quotes: ['"Keep \'em still, lad."', '"Never been in better hands."'],
      characters: { young: 'Vulnerable, endangered', old: 'Sadistic, taunting' },
      imagery: 'Young dangling 50 feet up. Pulley wheel flying off. Gull pecking at leg.',
      themes: ['trust betrayed', 'death wish', 'predation'],
      tension: 8,
      mythologyRef: 'Icarus falling; tower as axis mundi',
      callbacks: [7], foreshadowing: [40] },

    { id: 11, act: 'act1', title: 'Demands Access to Light', types: ['conflict', 'revelation'],
      location: 'INT. Machine Room',
      time: 'Week 2',
      summary: 'Young hauls an immense oil drum up four stories. Exhausted, he reaches toward the lantern room hatch. Old startles him: "YOU DON\'T GO IN THERE!" Old shows him the proper small brass canister, mocking his effort. Young watches Old unlock the door with BRASS KEYS on his watch chain: "The light\'s mine. See to yer duties."',
      symbols: ['brass keys', 'the light', 'locked door', 'oil drum'],
      quotes: ['"YOU DON\'T GO IN THERE!"', '"The light\'s mine. See to yer duties."'],
      characters: { young: 'Curious, exhausted, mocked', old: 'Protective, secretive, cruel' },
      imagery: 'Immense oil drum. Brass keys on watch chain. Hatch to forbidden lantern room.',
      themes: ['forbidden knowledge', 'gatekeeping', 'desire'],
      tension: 7,
      mythologyRef: 'Bluebeard\'s locked room; forbidden fruit',
      callbacks: [5], foreshadowing: [38, 39] },

    { id: 12, act: 'act1', title: 'Bad Luck to Kill a Seabird', types: ['mythology', 'warning'],
      location: 'INT. Galley',
      time: 'Week 2 - Night',
      summary: 'Old reveals his previous assistant "went mad"—believed there was enchantment in the light, raved about sirens and merfolk. When Young laughs at superstition, Old SLAPS HIM HARD: "Bad luck to kill a sea bird." Seagulls contain the souls of dead sailors. Old\'s terror is genuine—he\'s shaken, a shell of himself.',
      symbols: ['seagull', 'superstition', 'the light', 'previous keeper'],
      quotes: ['"Bad luck to kill a sea bird."', '"In \'em\'s the souls o\' sailors what met their maker."'],
      characters: { young: 'Dismissive, shocked', old: 'Terrified, genuine fear' },
      imagery: 'Old slapping Young hard. Old shaken, shell of himself.',
      themes: ['superstition', 'fate', 'hubris'],
      tension: 7,
      mythologyRef: 'Rime of the Ancient Mariner - albatross curse',
      callbacks: [7], foreshadowing: [17, 41] },

    // ACT II - THE STORM
    { id: 13, act: 'act2', title: 'Names Exchanged', types: ['bonding', 'dialogue'],
      location: 'INT. Galley / Parlor',
      time: 'End of Week 2',
      summary: 'Young finally reveals his name: Ephraim Winslow, a timber man from Canada. He claims he\'s looking for a fresh start, to save earnings and raise his own roof. Old is Thomas Wake, thirteen Christmases at sea, abandoned his family. "She never forgave it." A moment of genuine connection between the two lonely men.',
      symbols: ['identity', 'timber', 'past', 'connection'],
      quotes: ['"Ephraim Winslow. These last two weeks, I\'d like it if you\'d call me by my name."', '"She never forgave it."'],
      characters: { young: 'Opening up, seeking humanity', old: 'Regretful, nostalgic' },
      imagery: 'Two men by firelight. Hardtack clanging like metal. Pipe smoke filling the room.',
      themes: ['identity', 'loneliness', 'male vulnerability'],
      tension: 4,
      mythologyRef: 'Names as power; revealing one\'s true self',
      callbacks: [], foreshadowing: [29, 33] },

    { id: 14, act: 'act2', title: 'Cigarette Goes Out', types: ['omen', 'supernatural'],
      location: 'INT. Parlor',
      time: 'Night',
      summary: 'Young tries to smoke his freshly-lit cigarette—but it goes out inexplicably. Old warns ominously: "Yer cigarette cinder goes out, there be someone somewhere\'s a-thinkin\' bad thoughts of ye. They be a-cursing yer name." Young re-lights nervously. Old toasts: "Let fear never abandon him."',
      symbols: ['cigarette', 'curse', 'omen', 'superstition'],
      quotes: ['"Yer cigarette cinder goes out, there be someone somewhere\'s a-thinkin\' bad thoughts of ye."', '"Let fear never abandon him."'],
      characters: { young: 'Uneasy, skeptical becoming fearful', old: 'Knowing, ominous' },
      imagery: 'Cigarette ember dying. Old\'s face in shadow. Stove fire flickering.',
      themes: ['fate', 'guilt', 'cosmic judgment'],
      tension: 5,
      mythologyRef: 'Russian superstition; the dead watching',
      callbacks: [], foreshadowing: [17, 29] },

    { id: 15, act: 'act2', title: 'Spying - Tentacles', types: ['hallucination', 'horror', 'voyeurism'],
      location: 'INT. Machine Room',
      time: 'Night',
      summary: 'Young retrieves his tobacco pouch from the clockwork machinery. He hears WHISPERING from above—Old, speaking of "the light" and "seed." Through the iron grates, he sees Old\'s sinewy torso vibrating, his arm moving VIGOROUSLY. White, viscous fluid drips from the grates. Then: A HUGE, SLIMY, TRANSLUCENT SQUID TENTACLE slithers across the ironwork and vanishes.',
      symbols: ['tentacles', 'the light', 'voyeurism', 'slime'],
      quotes: ['"The light... seed... Veritas..."'],
      characters: { young: 'Horrified voyeur', old: 'Ecstatic communion with cosmic entity' },
      imagery: 'Clockwork spinning hypnotically. Viscous fluid dripping. Translucent tentacle slithering.',
      themes: ['cosmic horror', 'forbidden knowledge', 'sexual transgression'],
      tension: 9,
      mythologyRef: 'Lovecraftian tentacles; sexual congress with the divine',
      callbacks: [5, 8], foreshadowing: [37], isHallucination: true },

    { id: 16, act: 'act2', title: 'Killing the One-Eyed Gull', types: ['violence', 'turning point'],
      location: 'EXT. Cistern',
      time: 'Day',
      summary: 'The cistern hatch is open. Inside: DEAD GULLS float in bloody water. One gull desperately tries to escape with a broken wing. The ONE-EYED GULL stands atop the cistern, raises its wings aggressively, lets out a HORRIFYING LONG-CALL, then swoops at Young\'s face. In wild rage, Young grasps it by the legs and BEATS IT AGAINST THE CISTERN until it\'s a BLOODY PULP OF FEATHERS.',
      symbols: ['one-eyed gull', 'cistern', 'violence', 'blood'],
      quotes: [],
      characters: { young: 'Enraged, violent, guilty', old: 'Absent' },
      imagery: 'Dead gulls in bloody water. Gull raising wings aggressively. Bloody pulp of feathers.',
      themes: ['murder', 'curse activation', 'loss of control'],
      tension: 9,
      mythologyRef: 'Killing the albatross (Rime of Ancient Mariner)',
      callbacks: [7, 12], foreshadowing: [17, 41], isViolence: true },

    { id: 17, act: 'act2', title: 'The Wind Changes', types: ['supernatural', 'consequence'],
      location: 'EXT. Lighthouse Tower',
      time: 'After gull death',
      summary: 'Young looks up at the WEATHERVANE atop the tower. The arrow points west... then the wind gusts. The arrow spins around and around wildly, finally settling HARD: EAST. A nor\'easter is coming. Old had warned him: "Bad luck to kill a sea bird." By killing the one-eyed gull, Young has cursed them both.',
      symbols: ['weathervane', 'wind', 'curse', 'east wind'],
      quotes: [],
      characters: { young: 'Dawning horror', old: 'Absent' },
      imagery: 'Weathervane arrow spinning wildly. Arrow settling hard east.',
      themes: ['consequence', 'cosmic justice', 'curse fulfilled'],
      tension: 8,
      mythologyRef: 'Aeolus and the winds; curse made manifest',
      callbacks: [12, 16], foreshadowing: [18, 19] },

    { id: 18, act: 'act2', title: 'Last Night Before Relief', types: ['bonding', 'celebration'],
      location: 'INT. Galley',
      time: 'End of Week 4',
      summary: 'Young and Old feast on LOBSTER pulled from Old\'s secret pot—the first good meal. Old offers grog: "\'Tis our last afore relief, I won\'t take no for an answer." Young gives in. "Damn! Like comin\' home." They drink, sing sea shanties, pound on the table: "Hurrah, we\'re homeward bound!" They\'re almost friends now.',
      symbols: ['lobster', 'drinking', 'shanties', 'relief'],
      quotes: ['"Damn! Like comin\' home."', '"Hurrah, we\'re homeward bound!"'],
      characters: { young: 'Joyful, letting go', old: 'Celebratory, paternal' },
      imagery: 'Mutilated lobster shells piled high. Pounding on table. Singing sea shanties.',
      themes: ['camaraderie', 'false hope', 'last supper'],
      tension: 3,
      mythologyRef: 'Last Supper before betrayal',
      callbacks: [4], foreshadowing: [20, 21] },

    { id: 19, act: 'act2', title: 'Tender Doesn\'t Come', types: ['dread', 'isolation'],
      location: 'EXT. Shore / INT. Galley',
      time: 'Day after Week 4',
      summary: 'They stand by the shore in full uniform, gunny sacks over shoulders, ditty boxes by their sides. Waiting. The rain pours. Hours pass. Nothing. They sit at the table, drenched, perfectly still. Very, very long pause. "They didn\'t come." The biblical storm has stranded them on the rock.',
      symbols: ['storm', 'isolation', 'tender', 'waiting'],
      quotes: ['"They didn\'t come."'],
      characters: { young: 'Stunned, hopeless', old: 'Resigned, knowing' },
      imagery: 'Two men in uniform by shore. Rain pouring. Sitting drenched and still.',
      themes: ['abandonment', 'fate', 'hope destroyed'],
      tension: 8,
      mythologyRef: 'Waiting for Godot; purgatory',
      callbacks: [17], foreshadowing: [20, 24] },

    { id: 20, act: 'act2', title: 'Calming the Sea', types: ['mythology', 'ritual'],
      location: 'EXT. Shore / Boathouse',
      time: 'Night - Storm',
      summary: 'Old stands before the crashing waves like a magician, counting: "Four... Five... Six... Seven... Eight... GO DOWN!" On the ninth wave, he makes the sign of the cross and DOUSES THE SEA with liquor. The wave dies! He sings "Blood Red Roses," invoking Neptune: "ABATE, O YE WAVES!" Then a MASSIVE WAVE CRASHES OVER HIM, knocking him down. The sea cannot be commanded.',
      symbols: ['Neptune', 'ritual', 'ninth wave', 'Blood Red Roses'],
      quotes: ['"GO DOWN!"', '"ABATE, O YE WAVES OF FATHER NEPTUNE!"'],
      characters: { young: 'Absent/watching', old: 'Defiant against nature, then humbled' },
      imagery: 'Old like a magician before waves. Sign of the cross. Massive wave crashing over him.',
      themes: ['hubris', 'man vs nature', 'pagan ritual'],
      tension: 8,
      mythologyRef: 'King Canute; Neptune worship; ninth wave superstition',
      callbacks: [12], foreshadowing: [26] },

    { id: 21, act: 'act2', title: 'Time Distorts', types: ['horror', 'psychological'],
      location: 'INT. Galley',
      time: 'Unknown',
      summary: 'Old insists they\'ve been stranded for WEEKS, begging Young to ration food. Young is bewildered—didn\'t they just miss the tender yesterday? "It\'s been weeks ago since we missed her." Old recalls a keeper stranded for SEVEN MONTHS. "The waters were too rageful neither to launch nor land." How long have they really been here? Time has become impossible to track.',
      symbols: ['time', 'madness', 'provisions', 'confusion'],
      quotes: ['"It\'s been weeks ago since we missed her."', '"Seven long months, he was."'],
      characters: { young: 'Confused, questioning reality', old: 'Certain of lost time' },
      imagery: 'Storm tearing outbuildings apart. Empty provisions. Confusion on faces.',
      themes: ['unreliable perception', 'madness', 'temporal dislocation'],
      tension: 7,
      mythologyRef: 'Time moves differently in the underworld',
      callbacks: [19], foreshadowing: [24] },

    { id: 22, act: 'act2', title: 'Digging Up Liquor', types: ['dark comedy'],
      location: 'EXT. Behind Quarters',
      time: 'Night - Storm',
      summary: 'Old hands Young a shovel: "DIG." They dig like madmen in the rain, creating a hole about the size of a GRAVE. Old unearths a WOODEN CRATE. Inside: TEN FULL BOTTLES OF BURIED BOOZE. "Rations," Young says ironically. This is their true priority. This hole will return later with darker purpose.',
      symbols: ['grave', 'liquor', 'burial', 'digging'],
      quotes: ['"DIG!"', '"Rations."'],
      characters: { young: 'Ironic, resigned', old: 'Gleeful, addicted' },
      imagery: 'Digging in rain. Grave-sized hole. Wooden crate of bottles.',
      themes: ['addiction', 'foreshadowing death', 'dark comedy'],
      tension: 5,
      mythologyRef: 'Digging one\'s own grave',
      callbacks: [2], foreshadowing: [35, 38] },

    { id: 23, act: 'act2', title: 'Mermaid on the Rocks', types: ['hallucination', 'horror', 'sexuality'],
      location: 'EXT. Shore',
      time: 'Storm',
      summary: 'Young sees something WHITE in the black rocks—a BODY. A NUDE WOMAN washed up, entangled in seaweed. The most beautiful woman he\'s ever seen. He touches her cheek, her mouth, moves down her body... Her ribs have wounds that look like GILLS. Below her waist: A FISH\'S TAIL. She opens her eyes and SMILES at him, raising her arms for embrace. THE FOGHORN BLASTS. Young RUNS.',
      symbols: ['mermaid', 'sexuality', 'death', 'seaweed'],
      quotes: [],
      characters: { young: 'Terrified desire', old: 'Absent' },
      imagery: 'White body in black rocks. Seaweed tangled. Gills in ribs. Fish tail. Smiling mermaid.',
      themes: ['death and sexuality', 'siren call', 'forbidden desire'],
      tension: 9,
      mythologyRef: 'Sirens; mermaid as death figure',
      callbacks: [6], foreshadowing: [27], isHallucination: true },

    // ACT III - MADNESS & RECKONING
    { id: 24, act: 'act3', title: 'Drinking and Fighting', types: ['chaos', 'violence', 'bonding'],
      location: 'INT. Living Quarters',
      time: 'Undefined - Storm continues',
      summary: 'Young and Old drink, sing, dance do-si-do, swing each other with linked elbows. The mood swings WILDLY—laughing one moment, fighting the next. They destroy the kitchen, hurling plates, throwing fish bones, smashing the soapbox against the range. Hysterically drunk. Demented. The line between friendship and violence has dissolved.',
      symbols: ['drinking', 'violence', 'shanties', 'destruction'],
      quotes: [],
      characters: { young: 'Manic, volatile', old: 'Manic, volatile' },
      imagery: 'Do-si-do dance. Hurling plates. Fish bones flying. Soapbox smashing.',
      themes: ['madness', 'destruction', 'masculine violence'],
      tension: 8,
      mythologyRef: 'Dionysian frenzy',
      callbacks: [18], foreshadowing: [30, 36], isViolence: true },

    { id: 25, act: 'act3', title: 'Almost a Kiss', types: ['intimacy', 'tension'],
      location: 'INT. Parlor',
      time: 'Night',
      summary: 'Old sings a haunting ballad about longing: "If I might give the whole world just to share her pillow, on a Monday morning." They slow dance, arms around each other. Young joins the last line. They lean in, SO CLOSE—it seems like they might KISS. The tension is unbearable. Young pushes Old away. They put up fists and start play-fighting.',
      symbols: ['intimacy', 'ballad', 'repression', 'homoeroticism'],
      quotes: ['"If I might give the whole world just to share her pillow, on a Monday morning."'],
      characters: { young: 'Conflicted desire', old: 'Vulnerable, longing' },
      imagery: 'Slow dancing. Faces close. Almost kissing. Fists raised.',
      themes: ['repressed sexuality', 'masculine intimacy', 'fear of vulnerability'],
      tension: 9,
      mythologyRef: 'Forbidden love; taboo',
      callbacks: [18], foreshadowing: [37] },

    { id: 26, act: 'act3', title: 'Neptune\'s Curse', types: ['mythology', 'horror', 'conflict'],
      location: 'INT. Bunkroom',
      time: 'Night',
      summary: 'Young insults Old\'s cooking. Old becomes DREADFULLY SERIOUS and delivers a TERRIFYING CURSE: "Hark, Triton, Hark! Bid our father, the sea king, rise from the depths... to smother this young mouth with pungent slime... choke ye, engorging yer organs till ye turn blue and bloated... his coral-tined trident screeches banshee-like and runs you through the gullet... forgotten to any man, to any god or devil, forgotten even to the sea." Young, terrified: "I like yer cooking."',
      symbols: ['Neptune', 'Triton', 'curse', 'sea king'],
      quotes: ['"Hark, Triton, Hark!"', '"Forgotten to any man, to any god or devil, forgotten even to the sea."', '"I like yer cooking."'],
      characters: { young: 'Terrified into submission', old: 'Possessed by ancient power' },
      imagery: 'Old speaking in prophetic voice. Eyes wild. Young cowering.',
      themes: ['divine wrath', 'power of words', 'hubris punished'],
      tension: 10,
      mythologyRef: 'Neptune/Poseidon; Triton; Greek sea mythology',
      callbacks: [12, 20], foreshadowing: [41], isRevelation: true },

    { id: 27, act: 'act3', title: 'Mermaid Visions', types: ['hallucination', 'violence', 'sexuality'],
      location: 'INT. Supply Shed',
      time: 'Day - Storm',
      summary: 'Young masturbates FURIOUSLY in the shed, staring at the mermaid carving. Images FLASH: the mermaid\'s breast, her mouth, the lighthouse as PHALLUS, her slimy vagina, tentacles writhing, a man in a mackinaw coat drowning, her face SCREAMING. He can\'t finish. In WILD RAGE, he THROWS the carving, BREAKING IT IN TWO. Then he STABS it with the dinner knife. "I fixed you. You can\'t git to me."',
      symbols: ['mermaid carving', 'tentacles', 'sexuality', 'destruction'],
      quotes: ['"I fixed you. You can\'t git to me."'],
      characters: { young: 'Frustrated, violent, self-deluded', old: 'Absent' },
      imagery: 'Flashing images: breast, mouth, lighthouse as phallus, tentacles, drowning man. Broken carving.',
      themes: ['sexual frustration', 'violence against feminine', 'denial'],
      tension: 9,
      mythologyRef: 'Lighthouse as phallus; mermaid as feminine threat',
      callbacks: [6, 8, 23], foreshadowing: [33], isHallucination: true, isViolence: true },

    { id: 28, act: 'act3', title: 'Head in Lobster Pot', types: ['hallucination', 'horror'],
      location: 'EXT. Shore',
      time: 'Day - Storm',
      summary: 'Young pulls up the lobster pot rope. Inside: THE SHRIVELED CORPSE HEAD OF A MAN WITH ONE EYE. The previous assistant? Small CRABS crawl out of the empty eye socket. A seagull flies by, SQUAWKING. Young nearly falls into the water from TERROR. The one-eyed gull haunts him even in death.',
      symbols: ['lobster pot', 'one-eyed corpse', 'previous keeper', 'crabs'],
      quotes: [],
      characters: { young: 'Terrified', old: 'Absent' },
      imagery: 'Shriveled corpse head. One eye. Crabs crawling from socket. Seagull squawking.',
      themes: ['guilt manifested', 'death returns', 'curse'],
      tension: 9,
      mythologyRef: 'Head of Orpheus; the dead return',
      callbacks: [7, 12], foreshadowing: [32], isHallucination: true },

    { id: 29, act: 'act3', title: 'Young\'s Confession', types: ['revelation', 'confession'],
      location: 'INT. Bunkroom',
      time: 'Night',
      summary: 'Young stares into space, feral-eyed: "I\'m Thomas. Tommy. Tom Howard." He confesses: On a log drive, he wanted to kill his foreman Winslow. "I saw him slippin\'... He shouted \'Tom, you dog!\' And I just stood. Just stood and watched \'im git swallowed down by them logs." He stole Winslow\'s identity for a clean slate. "Ephraim Winslow has a spiffy clean slate. Thomas Howard, he don\'t."',
      symbols: ['identity', 'murder by inaction', 'confession', 'logs'],
      quotes: ['"I\'m Thomas. Tommy. Tom Howard."', '"I just stood. Just stood and watched \'im git swallowed down by them logs."'],
      characters: { young: 'Confessing, hollow', old: 'Listening, knowing' },
      imagery: 'Young staring into space. Feral eyes. Firelight.',
      themes: ['guilt', 'identity theft', 'confession'],
      tension: 8,
      mythologyRef: 'Cain and Abel; stolen identity',
      callbacks: [6, 13, 14], foreshadowing: [33, 37], isRevelation: true },

    { id: 30, act: 'act3', title: 'Old\'s Eyes Shine', types: ['hallucination', 'horror', 'supernatural'],
      location: 'EXT. Catwalk',
      time: 'Night - Storm',
      summary: 'Young finds a BODY face-down on the catwalk—in a MACKINAW COAT. He turns it over: IT\'S HIS OWN FACE. His DOPPELGANGER, pale and dead. WALK-DRAG footsteps behind him. Old grabs his wrist, NAKED. His eyes are closed. Slowly, Old OPENS HIS EYES—A LIGHT BRIGHTER THAN ANYTHING bathes Young\'s face. Old\'s eyes SHINE LIKE THE LIGHTHOUSE BEACON.',
      symbols: ['doppelganger', 'the light', 'transformation', 'mackinaw coat'],
      quotes: [],
      characters: { young: 'Terrified of himself', old: 'Transformed, godlike' },
      imagery: 'Body in mackinaw coat. Own face dead. Old naked. Eyes shining like beacon.',
      themes: ['death of self', 'transcendence', 'the divine terrible'],
      tension: 10,
      mythologyRef: 'Prometheus; looking upon god\'s face',
      callbacks: [5, 6], foreshadowing: [40], isHallucination: true },

    { id: 31, act: 'act3', title: 'Lifeboat Destroyed', types: ['violence', 'entrapment'],
      location: 'INT/EXT. Boathouse',
      time: 'Dawn',
      summary: 'Young desperately tries to launch the DORY, throwing on a cork life vest. Old appears: "DON\'T LEAVE ME!" He SWIPES through the air with a FIRE AXE, SMASHING the boat. Young runs. They chase through the island. Old swings the axe, missing, and BURIES IT DEEP IN THE KITCHEN TABLE. They are now both trapped on this rock forever.',
      symbols: ['axe', 'lifeboat', 'entrapment', 'life vest'],
      quotes: ['"DON\'T LEAVE ME!"'],
      characters: { young: 'Desperate to escape', old: 'Manic, possessive' },
      imagery: 'Cork life vest. Fire axe swinging. Boat smashed. Axe buried in table.',
      themes: ['entrapment', 'co-dependency', 'no escape'],
      tension: 9,
      mythologyRef: 'Burning bridges; Orpheus looking back',
      callbacks: [19], foreshadowing: [38, 39], isViolence: true },

    { id: 32, act: 'act3', title: 'Accusation of Murder', types: ['confrontation'],
      location: 'INT. Parlor',
      time: 'After chase',
      summary: 'Young smiles, crazed: "I found him. Yer one-eyed junior man. In the lobster pot. You made him mad with that charm!" He throws the broken mermaid pieces at Old\'s feet, celebrating: "I broke it! I\'m FREE from yer designs!" He does a triumphant jig. Old looks at him with PITY. Young stops jigging.',
      symbols: ['mermaid carving', 'accusation', 'previous keeper', 'madness'],
      quotes: ['"I found him. Yer one-eyed junior man."', '"I broke it! I\'m FREE from yer designs!"'],
      characters: { young: 'Manic, delusional', old: 'Pitying, knowing' },
      imagery: 'Broken mermaid pieces. Triumphant jig. Old\'s pitying look.',
      themes: ['false victory', 'delusion', 'projection'],
      tension: 7,
      mythologyRef: 'False triumph; hubris before fall',
      callbacks: [2, 12, 28], foreshadowing: [] },

    { id: 33, act: 'act3', title: 'Gaslighting', types: ['psychological', 'manipulation'],
      location: 'INT. Parlor',
      time: 'Continuous',
      summary: 'Old flips the narrative completely: "YOU made a confession \'twould make a saint swear. It\'s made ye MAD. YOU smashed the life boat, a-chasing ME with an axe." He demands the pocketed dinner knife. Young hands it over like a guilty child. "How long have we been on this rock? Five week? Two days? Who are you, Tommy? Yer probably a figment of yer own imagination."',
      symbols: ['identity', 'gaslighting', 'reality', 'manipulation'],
      quotes: ['"YOU smashed the life boat, a-chasing ME with an axe."', '"Yer probably a figment of yer own imagination."'],
      characters: { young: 'Confused, submissive', old: 'Manipulative, in control' },
      imagery: 'Old flipping narrative. Young handing over knife. Reality dissolving.',
      themes: ['gaslighting', 'reality vs perception', 'psychological abuse'],
      tension: 8,
      mythologyRef: 'Unreliable narrator; solipsism',
      callbacks: [29], foreshadowing: [35] },

    { id: 34, act: 'act3', title: 'Thieves\' Oil', types: ['dark comedy', 'desperation'],
      location: 'INT. Oil Room',
      time: 'Later',
      summary: 'Out of liquor, Young drips HONEY into a brass kerosene canister. He pours in TURPENTINE and stirs. "Thieves\' oil." They drink it like giddy children, fighting over the canister. The storm continues. WATER FLOODS the quarters through smashed windows. They LAUGH HYSTERICALLY as waves crash. Laughing... laughing... laughing... until fade to black.',
      symbols: ['turpentine', 'honey', 'madness', 'laughter'],
      quotes: ['"Thieves\' oil."'],
      characters: { young: 'Desperate, manic', old: 'Gleeful, childlike' },
      imagery: 'Honey dripping. Turpentine mixing. Water flooding. Hysterical laughter.',
      themes: ['desperation', 'absurdity', 'self-destruction'],
      tension: 7,
      mythologyRef: 'Drinking poison; communion with death',
      callbacks: [22], foreshadowing: [38] },

    { id: 35, act: 'act3', title: 'Reading the Logbook', types: ['revelation', 'betrayal'],
      location: 'INT. Parlor',
      time: 'Morning - After storm',
      summary: 'Young stands in ankle-deep water, pissing into a floating chamber pot. OLD\'S LOGBOOK floats by. He snatches it, reads by the window. Beautiful mementos inside—children\'s hair, tintypes. Then THE LOG ENTRIES: "Assistant slept late. Work below standard." "Attitude Hostile." "Drunk on duty." "Assault." "I do not feel safe. RECOMMEND SEVERANCE WITHOUT PAY." Young SMASHES the clock.',
      symbols: ['logbook', 'betrayal', 'truth', 'severance'],
      quotes: ['"Work below standard."', '"RECOMMEND SEVERANCE WITHOUT PAY."'],
      characters: { young: 'Betrayed, enraged', old: 'Absent (betrayer revealed)' },
      imagery: 'Ankle-deep water. Floating logbook. Children\'s hair and tintypes. Smashed clock.',
      themes: ['betrayal', 'written record vs truth', 'institutional power'],
      tension: 9,
      mythologyRef: 'Pandora\'s box; forbidden knowledge',
      callbacks: [2, 9], foreshadowing: [36], isRevelation: true },

    { id: 36, act: 'act3', title: 'You\'re a Liar!', types: ['confrontation', 'rage'],
      location: 'INT. Galley',
      time: 'Morning',
      summary: 'Young EXPLODES with a vile tirade of insults. Old responds by calling him a "painted actress" and demands: "Will y\'kill me like y\'done that gull?" He calls Young a dog repeatedly—the ultimate dehumanization. Young trembles with rage, on the edge of murder.',
      symbols: ['father', 'dog', 'truth', 'rage'],
      quotes: ['"You ain\'t my FATHER!"', '"\'Twas YE what damned us, DOG!"'],
      characters: { young: 'Explosive rage', old: 'Goading, masochistic' },
      imagery: 'Screaming in each other\'s faces. Spittle flying. Trembling with rage.',
      themes: ['patricide', 'dehumanization', 'truth revealed'],
      tension: 10,
      mythologyRef: 'Oedipus; killing the father',
      callbacks: [9, 29], foreshadowing: [37] },

    { id: 37, act: 'act3', title: 'Tentacle Fight', types: ['hallucination', 'violence', 'climax'],
      location: 'INT. Living Quarters',
      time: 'Continuous',
      summary: 'They ATTACK each other, going for throats, WRESTLING, breathing, sweating, legs entwined. Young looks down—it\'s no longer Old. It\'s EPHRAIM WINSLOW in his mackinaw. Winslow SPITS in his face. Young strangles him but Winslow becomes THE MERMAID, her tail thrashing. She becomes Old—NAKED, with ENORMOUS SQUID TENTACLES FOR LEGS, wrapping around Young. He punches again and again. Finally: just a bloody old man.',
      symbols: ['tentacles', 'mermaid', 'Winslow', 'transformation'],
      quotes: [],
      characters: { young: 'Murderous, dissociated', old: 'Victim/monster/hallucination' },
      imagery: 'Wrestling bodies. Winslow\'s face. Mermaid tail. Tentacles wrapping. Bloody old man.',
      themes: ['identity dissolution', 'violence as intimacy', 'guilt manifested'],
      tension: 10,
      mythologyRef: 'Proteus shape-shifting; killing one\'s demons',
      callbacks: [6, 15, 23, 25, 27], foreshadowing: [38], isHallucination: true, isViolence: true },

    { id: 38, act: 'act3', title: 'Buried Alive', types: ['violence', 'horror', 'revenge'],
      location: 'EXT. The Grave',
      time: 'Afternoon',
      summary: 'Young walks Old on a LEASH like a dog. "Good boy." He forces Old into the grave-sized hole they dug for liquor. "Bark, laddy! Bark!" Old: "Ruff! Ruff!" Young shovels mud onto him. Old prophesies through bloody lips: "Y\'wish to see what\'s in that lantern? So did me last assistant. You\'ll be punished." More mud. Is he dead?',
      symbols: ['grave', 'dog', 'burial', 'prophecy'],
      quotes: ['"Good boy."', '"Bark, laddy! Bark!"', '"You\'ll be punished."'],
      characters: { young: 'Sadistic, triumphant', old: 'Degraded, prophetic' },
      imagery: 'Old on leash. Barking like dog. Mud shoveled onto face. Prophetic warning.',
      themes: ['role reversal', 'dehumanization', 'premature burial'],
      tension: 10,
      mythologyRef: 'Antigone burying Polyneices; premature burial',
      callbacks: [9, 22, 36], foreshadowing: [39], isViolence: true },

    { id: 39, act: 'act3', title: 'Old Returns with Axe', types: ['violence', 'horror', 'murder'],
      location: 'INT. Galley',
      time: 'Moments later',
      summary: 'Young retrieves his tobacco pouch. The hole in the table is empty—THE AXE IS GONE. OLD, covered in mud, barely alive, SWINGS THE AXE INTO YOUNG\'S SHOULDER. Blood gushes. Young grabs the IRON KETTLE and BASHES Old\'s face. Then he picks up the axe... lifts it high... DRIVES IT INTO OLD\'S HEAD. He toasts the corpse with the old prayer.',
      symbols: ['axe', 'murder', 'kettle', 'toast'],
      quotes: ['"Should pale death..."'],
      characters: { young: 'Murderer, victorious', old: 'Dead' },
      imagery: 'Empty axe hole in table. Axe in shoulder. Kettle to face. Axe to head.',
      themes: ['murder', 'cycle complete', 'ironic prayer'],
      tension: 10,
      mythologyRef: 'Cain killing Abel; patricide',
      callbacks: [31], foreshadowing: [40], isViolence: true },

    { id: 40, act: 'act3', title: 'Into the Light', types: ['climax', 'revelation', 'tragedy'],
      location: 'INT. Lantern Room',
      time: 'Night',
      summary: 'Crawling, trembling, bleeding, Young ascends the tower. He UNLOCKS the hatch with Old\'s BRASS KEYS. The FRESNEL LENS is a massive, six-foot jewel with eight brass legs. It seems to SING. Its rotation decelerates... stops. The lens doors OPEN LIKE WINGS. He reaches into the light. His hand BURNS. He sees something... His face DISTORTS in terror. He FALLS backward down four stories of stairs. THUD.',
      symbols: ['the light', 'fresnel lens', 'Prometheus', 'fall', 'brass keys'],
      quotes: [],
      characters: { young: 'Seeking forbidden knowledge', old: 'Dead' },
      imagery: 'Crawling up stairs. Six-foot lens like jewel. Lens doors opening like wings. Burning hand. Falling.',
      themes: ['forbidden knowledge', 'divine punishment', 'Icarus/Prometheus'],
      tension: 10,
      mythologyRef: 'Prometheus stealing fire; Icarus flying too close; looking upon God',
      callbacks: [5, 10, 11, 30], foreshadowing: [], isRevelation: true },

    { id: 41, act: 'act3', title: 'Prometheus Punished', types: ['ending', 'mythology', 'horror'],
      location: 'EXT. Pilot Rock',
      time: 'Dawn',
      summary: 'Young lies NAKED on the rocks, bones broken, splayed out like a sacrifice. His eyes are BURNT-OUT SOCKETS—blind. Seaweed wraps around him. A seabird PECKS at his abdomen. Peck. Peck. Peck. It is THE ONE-EYED GULL. DOZENS of birds descend, eating his LIVER. Prometheus stole fire from the gods and was punished for eternity. Young stole the forbidden light. THE END.',
      symbols: ['Prometheus', 'seagulls', 'liver', 'punishment', 'mythology'],
      quotes: [],
      characters: { young: 'Punished for hubris', old: 'Dead' },
      imagery: 'Naked on rocks. Burnt-out eye sockets. One-eyed gull. Birds eating liver.',
      themes: ['divine punishment', 'eternal torment', 'hubris punished'],
      tension: 10,
      mythologyRef: 'Prometheus bound; eagle eating liver for eternity',
      callbacks: [1, 7, 12, 16, 17, 26], foreshadowing: [], isViolence: true }
];

// Thematic connections
const THEMATIC_LINKS = [
    { source: 2, target: 35, theme: 'The Logbook' },
    { source: 5, target: 40, theme: 'The Forbidden Light' },
    { source: 6, target: 29, theme: 'Identity & Guilt' },
    { source: 6, target: 30, theme: 'The Doppelganger' },
    { source: 7, target: 41, theme: 'The One-Eyed Gull' },
    { source: 9, target: 36, theme: 'Dog Motif' },
    { source: 12, target: 17, theme: 'The Curse' },
    { source: 12, target: 26, theme: 'Neptune\'s Wrath' },
    { source: 15, target: 37, theme: 'Tentacles' },
    { source: 22, target: 38, theme: 'The Grave' },
    { source: 23, target: 37, theme: 'Mermaid Transformations' },
    { source: 10, target: 40, theme: 'The Fall' }
];

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    selectedNode: null,
    lockedNode: null,
    searchQuery: '',
    activeActs: new Set(),
    activeMarkers: new Set(),  // Track active scene type filters (hallucination, violence, revelation)
    activeConnections: new Set(),  // Track active connection type filters (foreshadowing, callback, thematic)
    viewedScenes: new Set(),
    data: null,
    root: null,
    showingFromModal: false  // Track if info card was opened from progress modal
};

// Load viewed scenes from localStorage
function loadProgress() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            state.viewedScenes = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.warn('Could not load progress:', e);
    }
}

// Save viewed scenes to localStorage
function saveProgress() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify([...state.viewedScenes]));
    } catch (e) {
        console.warn('Could not save progress:', e);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getActColor(actId) {
    return CONFIG.ACT_COLORS[actId] || '#666666';
}

function getActIcon(actId) {
    return CONFIG.ACT_ICONS[actId] || '';
}

function getActName(actId) {
    return CONFIG.ACT_NAMES[actId] || '';
}

function getTensionColor(tension) {
    if (tension <= 3) return '#43a047'; // Green - low tension
    if (tension <= 5) return '#ffc107'; // Yellow - medium tension
    if (tension <= 7) return '#ff9800'; // Orange - high tension
    return '#c44536'; // Red - extreme tension
}

function isScene(d) {
    return d.data && d.data.id !== undefined;
}

function isAct(d) {
    return d.data && d.data.act && !d.data.id;
}

// ============================================
// HIERARCHY CONSTRUCTION
// ============================================

function buildHierarchy() {
    // Build hierarchical data structure
    const root = {
        name: 'The Lighthouse',
        children: []
    };

    // Group scenes by act
    const acts = {};
    SCENES.forEach(scene => {
        if (!acts[scene.act]) {
            acts[scene.act] = {
                name: CONFIG.ACT_NAMES[scene.act],
                act: scene.act,
                children: []
            };
        }
        acts[scene.act].children.push({
            ...scene,
            name: scene.title
        });
    });

    root.children = Object.values(acts);
    return root;
}

function packageImports(nodes) {
    const map = {};
    const imports = [];

    // Build map of scene id to node
    nodes.forEach(d => {
        if (d.data.id) {
            map[d.data.id] = d;
        }
    });

    // Build connection paths for callbacks and foreshadowing
    nodes.forEach(d => {
        if (d.data.callbacks) {
            d.data.callbacks.forEach(targetId => {
                if (map[targetId]) {
                    imports.push({
                        source: map[targetId],
                        target: d,
                        type: 'callback'
                    });
                }
            });
        }
        if (d.data.foreshadowing) {
            d.data.foreshadowing.forEach(targetId => {
                if (map[targetId]) {
                    imports.push({
                        source: d,
                        target: map[targetId],
                        type: 'foreshadowing'
                    });
                }
            });
        }
    });

    // Add thematic links
    THEMATIC_LINKS.forEach(link => {
        if (map[link.source] && map[link.target]) {
            imports.push({
                source: map[link.source],
                target: map[link.target],
                type: 'thematic',
                theme: link.theme
            });
        }
    });

    return imports;
}

// ============================================
// TOOLTIP
// ============================================

let tooltip = null;

function createTooltip() {
    tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip');
    return tooltip;
}

function showTooltip(d, event) {
    if (!tooltip) createTooltip();
    if (!d.data.id) return; // Only show for scenes

    const scene = d.data;
    const types = scene.types ? scene.types.map(t =>
        `<span class="tooltip-type" style="background: ${CONFIG.TYPE_COLORS[t] || '#666'};">${t}</span>`
    ).join(' ') : '';

    // Location and time info
    const locationTime = scene.location || scene.time ?
        `<div class="tooltip-location">${scene.location || ''}${scene.location && scene.time ? ' • ' : ''}${scene.time || ''}</div>` : '';

    tooltip.html(`
        <div class="tooltip-header">
            <span class="tooltip-icon">${getActIcon(scene.act)}</span>
            <span class="tooltip-title">${scene.id}. ${scene.title}</span>
        </div>
        ${locationTime}
        <div class="tooltip-types">${types}</div>
        <div class="tooltip-summary">${scene.summary}</div>
        ${scene.symbols ? `<div class="tooltip-symbols"><strong>Key Symbols:</strong> ${scene.symbols.join(', ')}</div>` : ''}
        <div class="tooltip-hint">Click for full details & connections</div>
    `);

    // Position tooltip
    const x = event.clientX;
    const y = event.clientY;
    const tooltipNode = tooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 300;
    const tooltipHeight = tooltipNode.offsetHeight || 150;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = x + 15;
    let top = y + 15;

    if (left + tooltipWidth > viewportWidth) {
        left = x - tooltipWidth - 15;
    }
    if (top + tooltipHeight > viewportHeight) {
        top = y - tooltipHeight - 15;
    }

    tooltip
        .style('left', Math.max(10, left) + 'px')
        .style('top', Math.max(10, top) + 'px')
        .classed('visible', true);
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classed('visible', false);
    }
}

// ============================================
// INFO CARD (CLICK)
// ============================================

let infoCard = null;
let infoCardBackdrop = null;

function createInfoCard() {
    if (!infoCardBackdrop) {
        infoCardBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'info-card-backdrop')
            .on('click', hideInfoCard);
    }

    infoCard = d3.select('body')
        .append('div')
        .attr('class', 'info-card')
        .attr('id', 'info-card');

    return infoCard;
}

function showInfoCard(d, event, updateInPlace = false) {
    if (!infoCard) createInfoCard();
    if (!d.data.id) return;

    const scene = d.data;
    const actColor = getActColor(scene.act);
    const isViewed = state.viewedScenes.has(scene.id);


    const types = scene.types ? scene.types.map(t =>
        `<span class="info-card-type" style="background: ${CONFIG.TYPE_COLORS[t] || '#666'};">${t}</span>`
    ).join(' ') : '';

    // Build connections HTML
    let connectionsHTML = '';

    if (scene.callbacks && scene.callbacks.length > 0) {
        const callbackItems = scene.callbacks.map(id => {
            const targetScene = SCENES.find(s => s.id === id);
            return targetScene ? `<a href="#" class="connection-link" data-scene="${id}">↩ #${id}: ${targetScene.title}</a>` : '';
        }).filter(x => x).join('');
        connectionsHTML += `<div class="connections-group"><strong>References Earlier:</strong>${callbackItems}</div>`;
    }

    if (scene.foreshadowing && scene.foreshadowing.length > 0) {
        const foreshadowItems = scene.foreshadowing.map(id => {
            const targetScene = SCENES.find(s => s.id === id);
            return targetScene ? `<a href="#" class="connection-link" data-scene="${id}">→ #${id}: ${targetScene.title}</a>` : '';
        }).filter(x => x).join('');
        connectionsHTML += `<div class="connections-group"><strong>Foreshadows:</strong>${foreshadowItems}</div>`;
    }

    // Thematic connections
    const thematicConnections = THEMATIC_LINKS.filter(l => l.source === scene.id || l.target === scene.id);
    if (thematicConnections.length > 0) {
        const thematicItems = thematicConnections.map(link => {
            const otherId = link.source === scene.id ? link.target : link.source;
            const otherScene = SCENES.find(s => s.id === otherId);
            return otherScene ? `<a href="#" class="connection-link thematic" data-scene="${otherId}">⚡ ${link.theme}: #${otherId}</a>` : '';
        }).filter(x => x).join('');
        connectionsHTML += `<div class="connections-group"><strong>Thematic Links:</strong>${thematicItems}</div>`;
    }

    infoCard.html(`
        <div class="info-card-header" style="border-left: 4px solid ${actColor};">
            <span class="info-card-icon">${getActIcon(scene.act)}</span>
            <div class="info-card-titles">
                <h5 class="info-card-scene">${scene.id}. ${scene.title}</h5>
                <p class="info-card-act">${getActName(scene.act)}</p>
            </div>
            <button class="info-card-close" onclick="window.hideInfoCard()" title="Close">×</button>
        </div>
        ${scene.location || scene.time ? `
        <div class="info-card-location">
            ${scene.location ? `<span class="location-text">📍 ${scene.location}</span>` : ''}
            ${scene.time ? `<span class="time-text">🕐 ${scene.time}</span>` : ''}
        </div>
        ` : ''}
        <div class="info-card-types">${types}</div>
        <div class="info-card-body">
            <p class="info-card-summary">${scene.summary}</p>
            ${scene.quotes && scene.quotes.length > 0 ? `
            <div class="info-card-quotes">
                <strong>💬 Key Dialogue:</strong>
                <div class="quotes-list">
                    ${scene.quotes.map(q => `<span class="quote-item">${q}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            ${scene.characters ? `
            <div class="info-card-characters">
                <strong>👤 Characters:</strong>
                <div class="characters-grid">
                    ${scene.characters.young ? `<span class="character-state"><strong>Young:</strong> ${scene.characters.young}</span>` : ''}
                    ${scene.characters.old ? `<span class="character-state"><strong>Old:</strong> ${scene.characters.old}</span>` : ''}
                </div>
            </div>
            ` : ''}
            ${scene.imagery ? `<p class="info-card-imagery"><strong>🎬 Visual Imagery:</strong> ${scene.imagery}</p>` : ''}
            ${scene.themes && scene.themes.length > 0 ? `
            <p class="info-card-themes"><strong>🎭 Themes:</strong> ${scene.themes.join(', ')}</p>
            ` : ''}
            ${scene.mythologyRef ? `<p class="info-card-mythology"><strong>📚 Mythology:</strong> ${scene.mythologyRef}</p>` : ''}
            ${scene.tension ? `
            <div class="info-card-tension">
                <strong>⚡ Tension Level:</strong>
                <div class="tension-bar">
                    <div class="tension-fill" style="width: ${scene.tension * 10}%; background: ${getTensionColor(scene.tension)};"></div>
                </div>
                <span class="tension-value">${scene.tension}/10</span>
            </div>
            ` : ''}
            ${scene.symbols ? `<p class="info-card-symbols"><strong>🔑 Key Symbols:</strong> ${scene.symbols.join(', ')}</p>` : ''}
        </div>
        <div class="info-card-footer">
            <button class="mark-viewed-btn ${isViewed ? 'viewed' : ''}" data-scene-id="${scene.id}">
                ${isViewed ? '✓ Viewed' : '○ Mark as Viewed'}
            </button>
        </div>
        ${connectionsHTML ? `<div class="info-card-connections">${connectionsHTML}</div>` : ''}
    `);

    // Add click handler for mark as viewed button
    infoCard.select('.mark-viewed-btn').on('click', function(event) {
        event.preventDefault();
        const sceneId = parseInt(this.dataset.sceneId);
        toggleViewed(sceneId);
        // Update button appearance
        const btn = d3.select(this);
        const nowViewed = state.viewedScenes.has(sceneId);
        btn.classed('viewed', nowViewed);
        btn.text(nowViewed ? '✓ Viewed' : '○ Mark as Viewed');
    });

    // Add click handlers for connection links - UPDATE IN PLACE
    infoCard.selectAll('.connection-link').on('click', function(event) {
        event.preventDefault();
        const sceneId = parseInt(this.dataset.scene);
        const targetScene = state.root.descendants().find(d => d.data.id === sceneId);
        if (targetScene) {
            // Update in place - don't reposition
            showInfoCard(targetScene, null, true);
            // Update node highlighting
            highlightConnections(targetScene);

            // Scroll to top of the card
            infoCard.node().scrollTop = 0;
        }
    });

    // Only reposition if not updating in place
    if (!updateInPlace) {
        positionInfoCard(event);
        // Reset scroll position to top only when opening a new card (not when clicking references)
        infoCard.node().scrollTop = 0;
    }

    // Only show backdrop if not opening from progress modal
    if (infoCardBackdrop && !state.showingFromModal) {
        infoCardBackdrop.classed('visible', true);
    }
    infoCard.classed('visible', true);
}

// Toggle viewed status for a scene
function toggleViewed(sceneId) {
    if (state.viewedScenes.has(sceneId)) {
        state.viewedScenes.delete(sceneId);
    } else {
        state.viewedScenes.add(sceneId);
    }
    saveProgress();
    updateProgressUI();
    updateNodeStyles();
}

// Update node visual styles based on viewed status
function updateNodeStyles() {
    if (!nodeGroup) return;

    // Update circle styles
    nodeGroup.selectAll('.node circle')
        .classed('viewed', d => state.viewedScenes.has(d.data.id));

    // Update checkmark visibility
    nodeGroup.selectAll('.node .node-checkmark')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0);

    // Update text label styles - color matches the act when viewed
    nodeGroup.selectAll('.node .node-label')
        .classed('viewed-label', d => state.viewedScenes.has(d.data.id))
        .attr('fill', d => state.viewedScenes.has(d.data.id) ? getActColor(d.data.act) : 'var(--viz-text)');
}

function hideInfoCard() {
    if (infoCard) {
        infoCard.classed('visible', false);
    }
    // Only hide backdrop if not showing from modal
    if (infoCardBackdrop && !state.showingFromModal) {
        infoCardBackdrop.classed('visible', false);
    }
    state.lockedNode = null;
    state.showingFromModal = false;
    hideTooltip(); // Also hide any tooltip that might be showing
    updateHighlights();
    // Update progress modal if it's still visible
    updateProgressModal();
}

window.hideInfoCard = hideInfoCard;

function positionInfoCard(event) {
    if (!infoCard) return;

    const cardNode = infoCard.node();
    const cardWidth = cardNode.offsetWidth || 400;
    const cardHeight = cardNode.offsetHeight || 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left, top;

    if (state.showingFromModal) {
        // Position to the right side when opened from progress modal
        // Progress modal is centered, so put info card on the right
        left = viewportWidth - cardWidth - 20;
        top = (viewportHeight - cardHeight) / 2;
    } else if (event && event.clientX !== undefined) {
        // Position near click
        left = event.clientX - cardWidth / 2;
        top = event.clientY - cardHeight / 2;
    } else {
        // Center in viewport
        left = (viewportWidth - cardWidth) / 2;
        top = (viewportHeight - cardHeight) / 2;
    }

    // Keep within viewport bounds
    left = Math.max(10, Math.min(left, viewportWidth - cardWidth - 10));
    top = Math.max(10, Math.min(top, viewportHeight - cardHeight - 10));

    infoCard
        .style('left', left + 'px')
        .style('top', top + 'px');
}

// ============================================
// RADIAL VISUALIZATION
// ============================================

let svg, g, nodeGroup, linkGroup;
let currentLinks = [];
let allNodes = [];

function initVisualization() {
    const container = d3.select('#visualization-container');
    container.select('.loading-overlay').remove();

    const diameter = CONFIG.DIAMETER;
    const radius = diameter / 2;
    const innerRadius = radius - 150;
    const verticalOffset = 50; // Shift diagram down by 50px
    const padding = 150; // Add padding on all sides to prevent cutoff

    svg = container.append('svg')
        .attr('viewBox', `${-radius - padding} ${-radius - verticalOffset - padding} ${diameter + padding * 2} ${diameter + verticalOffset + padding * 2}`)
        .attr('width', '100%')
        .attr('height', diameter + verticalOffset + padding * 2)
        .style('max-width', `${diameter + padding * 2}px`)
        .style('font', '12px sans-serif');

    // Add gradient definitions
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    g = svg.append('g');

    // Build hierarchy
    const hierarchyData = buildHierarchy();
    state.root = d3.hierarchy(hierarchyData);

    // Create cluster layout
    const cluster = d3.cluster()
        .size([360, innerRadius]);

    cluster(state.root);

    // Get all nodes
    allNodes = state.root.descendants();

    // Build links
    currentLinks = packageImports(allNodes.filter(d => d.data.id));

    // Draw links first (behind nodes)
    linkGroup = g.append('g')
        .attr('class', 'links')
        .attr('fill', 'none');

    // Draw curved links
    const line = d3.lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x * Math.PI / 180);

    linkGroup.selectAll('.link')
        .data(currentLinks)
        .join('path')
        .attr('class', d => `link link-${d.type}`)
        .attr('d', d => {
            // Create path through parent
            const sourcePath = d.source.path(d.target);
            return line(sourcePath);
        })
        .attr('stroke', d => {
            if (d.type === 'callback') return '#8b5a8b';
            if (d.type === 'thematic') return '#b8860b';
            return '#5a8b5a';
        })
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', d => d.type === 'callback' ? '5,3' : null);

    // Draw nodes
    nodeGroup = g.append('g')
        .attr('class', 'nodes');

    const nodes = nodeGroup.selectAll('.node')
        .data(allNodes.filter(d => d.data.id)) // Only scene nodes
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y},0)`)
        .on('mouseover', function(event, d) {
            if (!state.lockedNode) {
                highlightConnections(d);
                showTooltip(d, event);
            }
        })
        .on('mouseout', function() {
            if (!state.lockedNode) {
                unhighlightAll();
                hideTooltip();
            }
        })
        .on('click', function(event, d) {
            event.stopPropagation();
            state.lockedNode = d;
            showInfoCard(d, event);
            highlightConnections(d);
        });

    // Node circles
    nodes.append('circle')
        .attr('r', 8)
        .attr('fill', d => getActColor(d.data.act))
        .attr('stroke', d => {
            if (d.data.isHallucination) return '#b8860b';
            if (d.data.isViolence) return '#8b0000';
            return '#fff';
        })
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => d.data.isHallucination ? '3,2' : null);

    // Checkmark indicator - positioned between node and text
    nodes.append('text')
        .attr('class', 'node-checkmark')
        .attr('dy', '0.31em')
        .attr('x', d => d.x < 180 ? 20 : -20)
        .attr('text-anchor', 'middle')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('fill', d => getActColor(d.data.act))
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0)
        .text('✓');

    // Node labels
    nodes.append('text')
        .attr('class', 'node-label')
        .attr('data-act', d => d.data.act)
        .attr('dy', '0.31em')
        .attr('x', d => d.x < 180 ? 32 : -32)
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('fill', 'var(--viz-text)')
        .attr('font-size', '10px')
        .style('cursor', 'pointer')
        .text(d => {
            const title = d.data.title.length > 20 ? d.data.title.substring(0, 20) + '...' : d.data.title;
            return `${d.data.id}. ${title}`;
        });


    // Apply viewed styles for any previously viewed scenes
    updateNodeStyles();
}

function highlightConnections(d) {
    if (!d.data.id) return;

    const connectedIds = new Set();
    connectedIds.add(d.data.id);

    // Add callbacks and foreshadowing
    if (d.data.callbacks) d.data.callbacks.forEach(id => connectedIds.add(id));
    if (d.data.foreshadowing) d.data.foreshadowing.forEach(id => connectedIds.add(id));

    // Add thematic connections
    THEMATIC_LINKS.forEach(link => {
        if (link.source === d.data.id) connectedIds.add(link.target);
        if (link.target === d.data.id) connectedIds.add(link.source);
    });

    // Dim non-connected nodes
    nodeGroup.selectAll('.node')
        .classed('dimmed', n => !connectedIds.has(n.data.id))
        .classed('highlighted', n => connectedIds.has(n.data.id) && n.data.id !== d.data.id)
        .classed('selected', n => n.data.id === d.data.id);

    // Highlight connected links
    linkGroup.selectAll('.link')
        .classed('dimmed', l => l.source.data.id !== d.data.id && l.target.data.id !== d.data.id)
        .classed('highlighted', l => l.source.data.id === d.data.id || l.target.data.id === d.data.id);
}

function unhighlightAll() {
    nodeGroup.selectAll('.node')
        .classed('dimmed', false)
        .classed('highlighted', false)
        .classed('selected', false);

    linkGroup.selectAll('.link')
        .classed('dimmed', false)
        .classed('highlighted', false);
}

function updateHighlights() {
    if (state.lockedNode) {
        highlightConnections(state.lockedNode);
    } else {
        unhighlightAll();
    }
}

// ============================================
// LEGEND
// ============================================

function initLegend() {
    const legendContainer = d3.select('#legend-container');

    // Header with progress
    const header = legendContainer.append('div')
        .attr('class', 'legend-header');

    header.append('span')
        .attr('class', 'legend-title')
        .text('Scenes Explored');

    const progressInline = header.append('div')
        .attr('class', 'progress-inline')
        .attr('title', 'Hover for summary, click for details')
        .on('mouseenter', showProgressTooltip)
        .on('mouseleave', hideProgressTooltip)
        .on('click', showProgressModal);

    progressInline.append('div')
        .attr('class', 'progress-bar-wrapper');

    progressInline.append('span')
        .attr('class', 'progress-text')
        .text('0/41');

    // Grid of legend items
    const grid = legendContainer.append('div')
        .attr('class', 'legend-grid');

    // Section label for Acts
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Filter by Act:');

    // Act colors with scene counts
    const actDetails = {
        'act1': { scenes: '1-12', count: 12 },
        'act2': { scenes: '13-23', count: 11 },
        'act3': { scenes: '24-41', count: 18 }
    };

    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const item = grid.append('div')
            .attr('class', 'legend-item')
            .attr('data-act', actId)
            .attr('title', `Click to filter: ${name} (${actDetails[actId].count} scenes)`)
            .on('click', () => toggleActFilter(actId));

        item.append('span')
            .attr('class', 'legend-color')
            .style('background-color', getActColor(actId));

        item.append('span')
            .attr('class', 'legend-icon')
            .text(CONFIG.ACT_ICONS[actId]);

        item.append('span')
            .attr('class', 'legend-text')
            .html(`${name.split(':')[0]} <small>(${actDetails[actId].count})</small>`);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Scene Types
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Scene Markers:');

    // Special markers with descriptions - now clickable for filtering
    const specialMarkers = [
        { key: 'hallucination', label: 'Hallucination', color: '#b8860b', dashed: true, desc: 'Click to filter: visions/dreams', field: 'isHallucination' },
        { key: 'violence', label: 'Violence', color: '#8b0000', dashed: false, desc: 'Click to filter: violent scenes', field: 'isViolence' },
        { key: 'revelation', label: 'Revelation', color: '#1a5a7a', dashed: false, desc: 'Click to filter: key plot reveals', field: 'isRevelation' }
    ];

    specialMarkers.forEach(marker => {
        const item = grid.append('div')
            .attr('class', 'legend-item legend-marker-item')
            .attr('data-marker', marker.key)
            .attr('title', marker.desc)
            .on('click', () => toggleMarkerFilter(marker.key, marker.field));

        item.append('span')
            .attr('class', 'legend-color')
            .style('background-color', marker.color)
            .style('border', marker.dashed ? '2px dashed #b8860b' : `2px solid ${marker.color}`);

        item.append('span')
            .attr('class', 'legend-text')
            .text(marker.label);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Connections
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Connection Lines:');

    // Connection type legend - now clickable for filtering
    const connectionTypes = [
        { key: 'foreshadowing', label: 'Foreshadowing', color: '#5a8b5a', style: 'solid', desc: 'Click to highlight: scenes that set up later events' },
        { key: 'callback', label: 'Callback', color: '#8b5a8b', style: 'dashed', desc: 'Click to highlight: scenes that reference earlier events' },
        { key: 'thematic', label: 'Thematic', color: '#b8860b', style: 'solid', desc: 'Click to highlight: scenes with shared symbols/motifs' }
    ];

    connectionTypes.forEach(conn => {
        const item = grid.append('div')
            .attr('class', 'legend-item legend-connection-item')
            .attr('data-connection', conn.key)
            .attr('title', conn.desc)
            .on('click', () => toggleConnectionFilter(conn.key));

        item.append('span')
            .attr('class', 'legend-line')
            .style('background-color', conn.color)
            .style('border-style', conn.style === 'dashed' ? 'dashed' : 'solid');

        item.append('span')
            .attr('class', 'legend-text')
            .text(conn.label);
    });

    updateProgressUI();
}

function toggleActFilter(actId) {
    if (state.activeActs.has(actId)) {
        state.activeActs.delete(actId);
    } else {
        state.activeActs.add(actId);
    }

    // Update legend item appearance
    d3.selectAll('.legend-item[data-act]')
        .classed('active', function() {
            return state.activeActs.has(this.dataset.act);
        });

    // Apply combined filters
    applyNodeFilters();
}

function toggleMarkerFilter(markerKey, field) {
    if (state.activeMarkers.has(markerKey)) {
        state.activeMarkers.delete(markerKey);
    } else {
        state.activeMarkers.add(markerKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-marker-item')
        .classed('active', function() {
            return state.activeMarkers.has(this.dataset.marker);
        });

    // Apply combined filters
    applyNodeFilters();
}

// Apply both act and marker filters to nodes
function applyNodeFilters() {
    if (!nodeGroup) return;

    const hasActFilter = state.activeActs.size > 0;
    const hasMarkerFilter = state.activeMarkers.size > 0;

    if (!hasActFilter && !hasMarkerFilter) {
        // No filters - show all
        nodeGroup.selectAll('.node').classed('filtered', false);
    } else {
        nodeGroup.selectAll('.node')
            .classed('filtered', d => {
                let passesActFilter = true;
                let passesMarkerFilter = true;

                // Check act filter
                if (hasActFilter) {
                    passesActFilter = state.activeActs.has(d.data.act);
                }

                // Check marker filter (scene must have at least one of the active markers)
                if (hasMarkerFilter) {
                    passesMarkerFilter = false;
                    if (state.activeMarkers.has('hallucination') && d.data.isHallucination) passesMarkerFilter = true;
                    if (state.activeMarkers.has('violence') && d.data.isViolence) passesMarkerFilter = true;
                    if (state.activeMarkers.has('revelation') && d.data.isRevelation) passesMarkerFilter = true;
                }

                // Must pass both filters (if both are active)
                return !(passesActFilter && passesMarkerFilter);
            });
    }
}

// Toggle connection type filter (foreshadowing, callback, thematic)
function toggleConnectionFilter(connectionKey) {
    if (state.activeConnections.has(connectionKey)) {
        state.activeConnections.delete(connectionKey);
    } else {
        state.activeConnections.add(connectionKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-connection-item')
        .classed('active', function() {
            return state.activeConnections.has(this.dataset.connection);
        });

    // Apply connection highlighting
    applyConnectionFilters();
}

// Highlight links based on connection type filter
function applyConnectionFilters() {
    if (!linkGroup) return;

    const hasConnectionFilter = state.activeConnections.size > 0;

    if (!hasConnectionFilter) {
        // No filters - reset all links
        linkGroup.selectAll('.link')
            .classed('highlighted', false)
            .classed('dimmed', false);
        nodeGroup.selectAll('.node')
            .classed('connection-highlighted', false)
            .classed('connection-dimmed', false);
        return;
    }

    // Find all scene IDs that have the selected connection types
    const highlightedSceneIds = new Set();

    nodeGroup.selectAll('.node').each(function(d) {
        if (!d.data.id) return;

        let hasMatchingConnection = false;

        // Check foreshadowing
        if (state.activeConnections.has('foreshadowing') && d.data.foreshadowing && d.data.foreshadowing.length > 0) {
            hasMatchingConnection = true;
            d.data.foreshadowing.forEach(id => highlightedSceneIds.add(id));
        }

        // Check callback
        if (state.activeConnections.has('callback') && d.data.callbacks && d.data.callbacks.length > 0) {
            hasMatchingConnection = true;
            d.data.callbacks.forEach(id => highlightedSceneIds.add(id));
        }

        // Check thematic
        if (state.activeConnections.has('thematic')) {
            const hasThematic = THEMATIC_LINKS.some(l => l.source === d.data.id || l.target === d.data.id);
            if (hasThematic) {
                hasMatchingConnection = true;
                THEMATIC_LINKS.forEach(l => {
                    if (l.source === d.data.id) highlightedSceneIds.add(l.target);
                    if (l.target === d.data.id) highlightedSceneIds.add(l.source);
                });
            }
        }

        if (hasMatchingConnection) {
            highlightedSceneIds.add(d.data.id);
        }
    });

    // Highlight matching links
    linkGroup.selectAll('.link')
        .classed('highlighted', function(d) {
            if (state.activeConnections.has('foreshadowing') && d.type === 'foreshadowing') return true;
            if (state.activeConnections.has('callback') && d.type === 'callback') return true;
            if (state.activeConnections.has('thematic') && d.type === 'thematic') return true;
            return false;
        })
        .classed('dimmed', function(d) {
            if (state.activeConnections.has('foreshadowing') && d.type === 'foreshadowing') return false;
            if (state.activeConnections.has('callback') && d.type === 'callback') return false;
            if (state.activeConnections.has('thematic') && d.type === 'thematic') return false;
            return true;
        });

    // Highlight matching nodes
    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', d => highlightedSceneIds.has(d.data.id))
        .classed('connection-dimmed', d => !highlightedSceneIds.has(d.data.id));
}

function updateProgressUI() {
    const total = 41;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    const progressWrapper = document.querySelector('.progress-bar-wrapper');
    const progressText = document.querySelector('.progress-text');

    if (!progressWrapper) return;

    // Count by act
    const viewedByAct = { act1: 0, act2: 0, act3: 0 };
    const totalByAct = { act1: 12, act2: 11, act3: 18 };

    state.viewedScenes.forEach(id => {
        const scene = SCENES.find(s => s.id === id);
        if (scene) {
            viewedByAct[scene.act]++;
        }
    });

    // Build progress segments
    progressWrapper.innerHTML = '';
    Object.entries(viewedByAct).forEach(([actId, count]) => {
        const actTotal = totalByAct[actId];
        const completionPercent = (count / actTotal) * 100;
        const actColor = getActColor(actId);

        // Convert hex color to RGB for rgba usage
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 100, g: 100, b: 100 };
        };

        const rgb = hexToRgb(actColor);

        const segment = document.createElement('div');
        segment.className = 'progress-bar-segment';
        segment.style.width = `${(actTotal / total) * 100}%`;
        // Light faded background using rgba (25% opacity)
        segment.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;

        const fill = document.createElement('div');
        fill.className = 'progress-inner-fill';
        fill.style.width = `${completionPercent}%`;
        // Full solid color for the completed portion
        fill.style.backgroundColor = actColor;
        segment.appendChild(fill);

        progressWrapper.appendChild(segment);
    });

    if (progressText) {
        progressText.textContent = `${viewed}/${total}`;
    }
}

// ============================================
// PROGRESS TOOLTIP (HOVER)
// ============================================

let progressTooltip = null;

function createProgressTooltip() {
    progressTooltip = d3.select('body')
        .append('div')
        .attr('class', 'progress-tooltip')
        .attr('id', 'progress-tooltip');
    return progressTooltip;
}

function showProgressTooltip(event) {
    if (!progressTooltip) createProgressTooltip();

    const total = 41;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Count by act
    const viewedByAct = { act1: 0, act2: 0, act3: 0 };
    const totalByAct = { act1: 12, act2: 11, act3: 18 };

    // Count by type
    const viewedByType = { hallucination: 0, violence: 0, revelation: 0 };
    const totalByType = { hallucination: 0, violence: 0, revelation: 0 };

    SCENES.forEach(scene => {
        if (scene.isHallucination) totalByType.hallucination++;
        if (scene.isViolence) totalByType.violence++;
        if (scene.isRevelation) totalByType.revelation++;

        if (state.viewedScenes.has(scene.id)) {
            viewedByAct[scene.act]++;
            if (scene.isHallucination) viewedByType.hallucination++;
            if (scene.isViolence) viewedByType.violence++;
            if (scene.isRevelation) viewedByType.revelation++;
        }
    });

    let tooltipHTML = `
        <div class="progress-tooltip-title">📊 Progress Summary</div>
        <div class="progress-tooltip-content">
    `;

    // Acts section
    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const count = viewedByAct[actId];
        const actTotal = totalByAct[actId];
        const actPercentage = Math.round((count / actTotal) * 100);

        tooltipHTML += `
            <div class="progress-tooltip-section" style="border-color: ${getActColor(actId)}">
                <div class="progress-tooltip-section-name">
                    <span class="progress-tooltip-section-icon">${CONFIG.ACT_ICONS[actId]}</span>
                    <span>${name.split('(')[0].trim()}</span>
                </div>
                <div class="progress-tooltip-section-count" style="color: ${getActColor(actId)}">
                    ${count}/${actTotal} (${actPercentage}%)
                </div>
            </div>
        `;
    });

    tooltipHTML += `
        </div>
        <div class="progress-tooltip-types">
            <div class="progress-tooltip-type-title">Scene Types Viewed:</div>
            <div class="progress-tooltip-type-grid">
                <span class="type-badge" style="background: #b8860b;">Hallucinations: ${viewedByType.hallucination}/${totalByType.hallucination}</span>
                <span class="type-badge" style="background: #8b0000;">Violence: ${viewedByType.violence}/${totalByType.violence}</span>
                <span class="type-badge" style="background: #1a5a7a;">Revelations: ${viewedByType.revelation}/${totalByType.revelation}</span>
            </div>
        </div>
        <div class="progress-tooltip-total">
            <span>Total: ${viewed}/${total} scenes</span>
            <span class="progress-tooltip-percentage">${percentage}%</span>
        </div>
        <div class="progress-tooltip-hint">Click for detailed view</div>
    `;

    progressTooltip.html(tooltipHTML);

    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    const tooltipNode = progressTooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 400;
    const tooltipHeight = tooltipNode.offsetHeight || 300;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let top = rect.bottom + 10;

    // Adjust if out of bounds
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
    }
    if (top + tooltipHeight > window.innerHeight - 10) {
        top = rect.top - tooltipHeight - 10;
    }

    progressTooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
        .classed('visible', true);
}

function hideProgressTooltip() {
    if (progressTooltip) {
        progressTooltip.classed('visible', false);
    }
}

// ============================================
// PROGRESS MODAL (CLICK)
// ============================================

let progressModal = null;
let progressModalBackdrop = null;

function createProgressModal() {
    if (!progressModalBackdrop) {
        progressModalBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'progress-modal-backdrop')
            .on('click', closeAllModals);
    }

    progressModal = d3.select('body')
        .append('div')
        .attr('class', 'progress-modal')
        .attr('id', 'progress-modal');

    return progressModal;
}

function showProgressModal() {
    hideProgressTooltip();
    if (!progressModal) createProgressModal();

    const total = 41;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Group scenes by act
    const scenesByAct = { act1: [], act2: [], act3: [] };
    SCENES.forEach(scene => {
        scenesByAct[scene.act].push(scene);
    });

    let modalHTML = `
        <div class="progress-modal-header">
            <h3 class="progress-modal-title">📊 Viewing Progress</h3>
            <div class="progress-modal-summary">
                <span class="progress-modal-count">${viewed}/${total} scenes (${percentage}%)</span>
            </div>
            <button class="progress-modal-close" onclick="window.hideProgressModal()">×</button>
        </div>
        <div class="progress-modal-body">
    `;

    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const scenes = scenesByAct[actId];
        const viewedCount = scenes.filter(s => state.viewedScenes.has(s.id)).length;
        const allViewed = viewedCount === scenes.length;

        modalHTML += `
            <div class="progress-section" data-act="${actId}">
                <div class="progress-section-header" style="border-color: ${getActColor(actId)}">
                    <input type="checkbox"
                           class="section-toggle-checkbox"
                           ${allViewed ? 'checked' : ''}
                           onchange="window.toggleActViewed('${actId}')"
                           title="Check/uncheck all scenes in this act">
                    <span class="progress-section-icon">${CONFIG.ACT_ICONS[actId]}</span>
                    <h4 class="progress-section-title" style="color: ${getActColor(actId)}">${name}</h4>
                    <span class="progress-section-count">${viewedCount}/${scenes.length}</span>
                </div>
                <div class="progress-section-scenes">
        `;

        scenes.forEach(scene => {
            const isViewed = state.viewedScenes.has(scene.id);
            const typeIndicators = [];
            if (scene.isHallucination) typeIndicators.push('<span class="scene-type-dot" style="background:#b8860b" title="Hallucination"></span>');
            if (scene.isViolence) typeIndicators.push('<span class="scene-type-dot" style="background:#8b0000" title="Violence"></span>');
            if (scene.isRevelation) typeIndicators.push('<span class="scene-type-dot" style="background:#1a5a7a" title="Revelation"></span>');

            modalHTML += `
                <div class="progress-item ${isViewed ? 'viewed' : ''}" data-scene-id="${scene.id}">
                    <input type="checkbox"
                           ${isViewed ? 'checked' : ''}
                           onchange="window.toggleSceneViewed(${scene.id})">
                    <span class="progress-item-number">${scene.id}.</span>
                    <label class="progress-item-label">${scene.title}</label>
                    <span class="progress-item-types">${typeIndicators.join('')}</span>
                    <button class="progress-item-info-btn" onclick="window.showSceneFromModal(${scene.id})" title="View details">ℹ️</button>
                </div>
            `;
        });

        modalHTML += `
                </div>
            </div>
        `;
    });

    modalHTML += `
        </div>
        <div class="progress-modal-footer">
            <button class="btn btn-sm btn-outline-secondary" onclick="window.resetAllProgress()">🔄 Reset All</button>
            <button class="btn btn-sm btn-outline-primary" onclick="window.markAllViewed()">✓ Mark All Viewed</button>
        </div>
    `;

    progressModal.html(modalHTML);

    if (progressModalBackdrop) {
        progressModalBackdrop.classed('visible', true);
    }
    progressModal.classed('visible', true);
}

function hideProgressModal() {
    if (progressModal) {
        progressModal.classed('visible', false);
    }
    if (progressModalBackdrop) {
        progressModalBackdrop.classed('visible', false);
    }
}

// Close all modals (both progress modal and info card)
function closeAllModals() {
    hideInfoCard();
    hideProgressModal();
}

function updateProgressModal() {
    if (!progressModal || !progressModal.classed('visible')) return;

    const total = 41;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Update header count
    progressModal.select('.progress-modal-count')
        .text(`${viewed}/${total} scenes (${percentage}%)`);

    // Update each act section
    Object.keys(CONFIG.ACT_NAMES).forEach(actId => {
        const scenes = SCENES.filter(s => s.act === actId);
        const viewedCount = scenes.filter(s => state.viewedScenes.has(s.id)).length;
        const allViewed = viewedCount === scenes.length;

        // Update section count
        progressModal.select(`.progress-section[data-act="${actId}"] .progress-section-count`)
            .text(`${viewedCount}/${scenes.length}`);

        // Update section checkbox
        progressModal.select(`.progress-section[data-act="${actId}"] .section-toggle-checkbox`)
            .property('checked', allViewed);
    });

    // Update individual scene checkboxes
    progressModal.selectAll('.progress-item').each(function() {
        const item = d3.select(this);
        const sceneId = parseInt(this.dataset.sceneId);
        const isViewed = state.viewedScenes.has(sceneId);

        item.classed('viewed', isViewed);
        item.select('input[type="checkbox"]').property('checked', isViewed);
    });
}

// Toggle all scenes in an act
function toggleActViewed(actId) {
    const scenes = SCENES.filter(s => s.act === actId);
    const allViewed = scenes.every(s => state.viewedScenes.has(s.id));

    if (allViewed) {
        scenes.forEach(s => state.viewedScenes.delete(s.id));
    } else {
        scenes.forEach(s => state.viewedScenes.add(s.id));
    }

    saveProgress();
    updateProgressUI();
    updateProgressModal();
    updateNodeStyles();
}

// Toggle single scene viewed status
function toggleSceneViewed(sceneId) {
    if (state.viewedScenes.has(sceneId)) {
        state.viewedScenes.delete(sceneId);
    } else {
        state.viewedScenes.add(sceneId);
    }

    saveProgress();
    updateProgressUI();
    updateProgressModal();
    updateNodeStyles();
}

// Show scene info from modal - keep progress modal visible in background
function showSceneFromModal(sceneId) {
    const targetScene = state.root.descendants().find(d => d.data.id === sceneId);
    if (targetScene) {
        // Don't hide progress modal - show info card on top
        state.showingFromModal = true;
        showInfoCard(targetScene, null, false);
        highlightConnections(targetScene);
    }
}

// Reset all progress
function resetAllProgress() {
    if (confirm('Reset all viewing progress? This cannot be undone.')) {
        state.viewedScenes.clear();
        saveProgress();
        updateProgressUI();
        updateProgressModal();
        updateNodeStyles();
    }
}

// Mark all as viewed
function markAllViewed() {
    SCENES.forEach(s => state.viewedScenes.add(s.id));
    saveProgress();
    updateProgressUI();
    updateProgressModal();
    updateNodeStyles();
}

// Expose functions globally
window.hideProgressModal = hideProgressModal;
window.toggleActViewed = toggleActViewed;
window.toggleSceneViewed = toggleSceneViewed;
window.showSceneFromModal = showSceneFromModal;
window.resetAllProgress = resetAllProgress;
window.markAllViewed = markAllViewed;

// ============================================
// SEARCH
// ============================================

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchCounter = document.getElementById('search-counter');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        state.searchQuery = query;

        if (!query) {
            nodeGroup.selectAll('.node').classed('search-match', false).classed('search-dimmed', false);
            searchCounter.classList.remove('visible');
            return;
        }

        let matchCount = 0;

        nodeGroup.selectAll('.node').each(function(d) {
            const matches =
                d.data.title.toLowerCase().includes(query) ||
                (d.data.summary && d.data.summary.toLowerCase().includes(query)) ||
                (d.data.symbols && d.data.symbols.some(s => s.toLowerCase().includes(query))) ||
                (d.data.types && d.data.types.some(t => t.toLowerCase().includes(query)));

            d3.select(this)
                .classed('search-match', matches)
                .classed('search-dimmed', !matches);

            if (matches) matchCount++;
        });

        searchCounter.textContent = `${matchCount}`;
        searchCounter.classList.add('visible');
        searchCounter.classList.toggle('has-results', matchCount > 0);
        searchCounter.classList.toggle('no-results', matchCount === 0);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
            hideInfoCard();
            clearBookClubHighlights();
        }
    });
}

// ============================================
// BOOK CLUB QUESTIONS
// ============================================

let activeBookClubQuestion = null;

function highlightBookClubScenes(element, event) {
    // Prevent any default behavior that might interfere on touch devices
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const scenesAttr = element.dataset.scenes;
    if (!scenesAttr) return;

    const sceneIds = scenesAttr.split(',').map(id => parseInt(id.trim()));

    // Toggle active state on questions
    const allQuestions = document.querySelectorAll('.book-club-question');
    const isAlreadyActive = element.classList.contains('active');

    // Remove active from all questions
    allQuestions.forEach(q => q.classList.remove('active'));

    if (isAlreadyActive) {
        // If clicking the same question, clear highlights
        clearBookClubHighlights();
        activeBookClubQuestion = null;
        return;
    }

    // Set new active question
    element.classList.add('active');
    activeBookClubQuestion = element;

    // Highlight the relevant nodes
    if (!nodeGroup) return;

    nodeGroup.selectAll('.node')
        .classed('book-club-highlight', d => sceneIds.includes(d.data.id))
        .classed('book-club-dimmed', d => !sceneIds.includes(d.data.id));

    // Scroll to the visualization
    const vizContainer = document.getElementById('visualization-container');
    if (vizContainer) {
        vizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function clearBookClubHighlights() {
    if (!nodeGroup) return;

    nodeGroup.selectAll('.node')
        .classed('book-club-highlight', false)
        .classed('book-club-dimmed', false);

    // Remove active state from all questions
    const allQuestions = document.querySelectorAll('.book-club-question');
    allQuestions.forEach(q => q.classList.remove('active'));

    activeBookClubQuestion = null;
}

// Add click handler to document to clear highlights when clicking outside questions
document.addEventListener('click', function(e) {
    // Check if click is outside the book club section
    const bookClubSection = document.getElementById('book-club-section');
    if (bookClubSection && !bookClubSection.contains(e.target) && activeBookClubQuestion) {
        clearBookClubHighlights();
    }
});

// Expose function globally for onclick handlers
window.highlightBookClubScenes = highlightBookClubScenes;
window.clearBookClubHighlights = clearBookClubHighlights;

// Toggle answer visibility
function toggleAnswer(event, button) {
    event.stopPropagation(); // Prevent triggering the question highlight

    const answerContent = button.nextElementSibling;
    const isVisible = answerContent.classList.contains('visible');

    if (isVisible) {
        answerContent.classList.remove('visible');
        button.classList.remove('active');
        button.textContent = 'Show Answer';
    } else {
        answerContent.classList.add('visible');
        button.classList.add('active');
        button.textContent = 'Hide Answer';
    }
}

window.toggleAnswer = toggleAnswer;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    initLegend();
    initVisualization();
    initSearch();
});

