#!/usr/bin/env python3
"""
Complete character development update for all 50 scenes in limitless_scenes_50.json
Based on detailed analysis of NeilBurger_2011_Limitless.txt screenplay
"""

import json

def load_json(filepath):
    """Load the JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    """Save the updated JSON file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# Complete character development data for all 50 scenes
CHARACTER_DEVELOPMENT = {
    1: {
        "eddie": {
            "state": "Transformed Eddie at peak crisis - stylish, lean, enhanced but cornered on penthouse ledge",
            "transformation": "End result shown first: complete physical and cognitive transformation, but facing death",
            "psychologicalState": "Fatalistic acceptance mixed with bitter regret; calm facing death but mourning the waste of potential; philosophical about becoming 'the perfect version' of himself"
        },
        "otherCharacters": [
            {
                "name": "Professional Killers",
                "role": "Unseen antagonists breaching Eddie's security door with power tools",
                "relationshipDynamics": "Eddie's mortal enemies - sophisticated, organized, deadly. Evolved to match his enhanced intelligence",
                "characterArcMoment": "Represent ultimate consequence of Eddie's NZT journey - people willing to kill him for the drug or to silence him"
            },
            {
                "name": "Neighbor",
                "role": "Collateral damage - middle-aged man who complains about noise",
                "relationshipDynamics": "Unknown neighbor who dies simply for opening his door",
                "characterArcMoment": "Shows how Eddie's choices create innocent casualties; buys Eddie 'half a minute' with his death"
            }
        ]
    },
    2: {
        "eddie": {
            "state": "Rock bottom Eddie - overweight, unmotivated, schlumpy, procrastinating writer with book contract but zero pages written",
            "transformation": "The 'before' state - establishing baseline that makes his later transformation so dramatic",
            "psychologicalState": "Self-aware about procrastination but trapped in it; ironic self-distance ('gearing up, that's all'); low self-esteem masked by cynicism; missed on-ramp at age 35"
        },
        "otherCharacters": []
    },
    3: {
        "eddie": {
            "state": "Devastated by breakup but initially trying to manipulate sympathy; finally drops defenses for rare honesty",
            "transformation": "Hits absolute bottom - losing last person who believed in him creates desperation that makes him vulnerable to NZT",
            "psychologicalState": "Desperate, hurt, finally honest: 'I don't think it is. There. Anything. At all.' - admits to internal void; still pining for ex-wife Melissa"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Girlfriend breaking up with Eddie out of self-preservation and love",
                "relationshipDynamics": "Loves Eddie but can't watch him self-destruct; sees through manipulation attempts; recently promoted, moving up while he crashes down; knows he still wants Melissa",
                "characterArcMoment": "Establishes her as loving but realistic, responsible adult Eddie isn't; 'If I didn't care, maybe I'd be able to stand to watch you do this'"
            }
        ]
    },
    4: {
        "eddie": {
            "state": "Self-conscious about weight gain and failures; defensive but has enough pride to be annoyed by Vernon's jabs",
            "transformation": "At absolute lowest point, making him maximally vulnerable to Vernon's pharmaceutical temptation",
            "psychologicalState": "Brutally honest when pushed: 'Not one fucking word, Vern' - rare glimpse behind defenses; feels physical decay matching mental stagnation"
        },
        "otherCharacters": [
            {
                "name": "Vernon Gant",
                "role": "Ex-brother-in-law, former drug dealer, now mysteriously wealthy - the tempter/devil figure",
                "relationshipDynamics": "Condescending amusement toward Eddie; comments on weight gain; knows Eddie's failures through Melissa; serves as proof-of-concept for NZT success",
                "characterArcMoment": "Introduction as someone transformed by NZT - expensive suit, confidence, wealth contrasting with former dealer status; receives threatening call hinting at danger ahead"
            }
        ]
    },
    5: {
        "eddie": {
            "state": "Undergoes radical transformation from baseline to enhanced within minutes after impulsively swallowing pill",
            "transformation": "The seduction moment - NZT doesn't make him someone else, it makes him the BEST version of himself; pupils contract, perception sharpens dramatically",
            "psychologicalState": "Experiences 'levels more, layers more, 3-D more...galactically more' clarity; accesses perfect recall of forgotten memories; feels depth and beauty of true perception for first time"
        },
        "otherCharacters": [
            {
                "name": "Valerie (Landlady)",
                "role": "Nasty young landlady demanding rent who becomes Eddie's first conquest on NZT",
                "relationshipDynamics": "Usually hostile and contemptuous toward Eddie; completely disarmed when Eddie demonstrates enhanced knowledge about Dorothea Lange photography, helps with her paper",
                "characterArcMoment": "Vehicle showing Eddie's transformation - he can charm anyone, recall obscure knowledge, help with academic work, have sex for hours; 'She didn't have a chance'"
            }
        ]
    },
    6: {
        "eddie": {
            "state": "Experiencing brutal crash after first dose - exhaustion, depression, tremors, desperate need for more pills",
            "transformation": "First experience of addiction cycle - the crash reveals the drug's true hook and dependency mechanism",
            "psychologicalState": "Desperation overrides all other concerns; already psychologically and physically dependent after single dose; will do anything for more"
        },
        "otherCharacters": [
            {
                "name": "Vernon Gant",
                "role": "Supplier and cautionary tale about NZT dangers",
                "relationshipDynamics": "Impressed Eddie wrote 90 pages overnight; warns about side effects and crash but still gives him supply; tells Eddie to 'taper off' while enabling continuation",
                "characterArcMoment": "Shows Vernon is beaten up and in danger (threatening phone call about meeting someone); Eddie entering dangerous underworld; gives Eddie baggie of ~100 pills"
            }
        ]
    },
    7: {
        "eddie": {
            "state": "On sustained NZT regimen, transforming physically and intellectually over two weeks - learning languages, getting fit, buying new clothes",
            "transformation": "The montage of becoming: learns Italian, Spanish, Mandarin; absorbs libraries; learns piano; masters martial arts concepts; gets in shape; upgrades appearance",
            "psychologicalState": "'I wasn't learning. I was remembering' - realizes NZT unlocks rather than creates; experiences fulfillment of human potential; becomes who he always thought he could be"
        },
        "otherCharacters": []
    },
    8: {
        "eddie": {
            "state": "Confident, transformed Eddie delivering completed manuscript - physically stylish, intellectually sharp, stark contrast to former self",
            "transformation": "First external validation that transformation is real and recognized by others; emboldened to take bigger risks",
            "psychologicalState": "Confident and articulate; feels vindicated; realizes he can achieve anything on NZT; ready to expand beyond just writing"
        },
        "otherCharacters": [
            {
                "name": "Mark Sutton (Publisher)",
                "role": "Eddie's skeptical publisher, shocked by transformation and manuscript quality",
                "relationshipDynamics": "Goes from sarcastic disbelief to genuine impressed shock; 'Jesus, Eddie. What happened to you?' - external mirror of Eddie's dramatic change",
                "characterArcMoment": "Validates Eddie's transformation is objective, not just subjective; reads manuscript and is genuinely impressed by quality"
            }
        ]
    },
    9: {
        "eddie": {
            "state": "On NZT but shocked and terrified discovering Vernon murdered - first confrontation with real mortal danger",
            "transformation": "Turns from enhancement story to survival thriller; realizes people kill for NZT; must navigate deadly landscape",
            "psychologicalState": "Terror mixed with opportunism - steals Vernon's hidden stash (500 pills, $20K cash, address book) while Vernon's body still warm; enhanced cognition helps him find hidden stash and escape"
        },
        "otherCharacters": [
            {
                "name": "Vernon Gant",
                "role": "Murder victim - beaten, tortured, shot in forehead; apartment ransacked",
                "relationshipDynamics": "Vernon's death serves as warning Eddie doesn't fully heed; his hidden stash becomes Eddie's lifeline",
                "characterArcMoment": "Death establishes mortal stakes; whoever killed Vernon was searching for NZT pills; Vernon left clues in his untouched stove"
            }
        ]
    },
    10: {
        "eddie": {
            "state": "Paranoid but hyper-aware on NZT - spots and evades mysterious blonde man following him from Vernon's building",
            "transformation": "Enhanced perception becomes double-edged sword - sees everything including threats, amplifying paranoia",
            "psychologicalState": "'On NZT, you see everything. Including the man who wants to kill you.' - awareness as curse and gift; realizes he's now hunted"
        },
        "otherCharacters": [
            {
                "name": "The Blonde Man",
                "role": "Large, professional stalker/killer following Eddie",
                "relationshipDynamics": "Patient, professional, dangerous predator hunting Eddie; knows about Eddie's connection to Vernon and NZT",
                "characterArcMoment": "Introduction of primary physical antagonist who will pursue Eddie throughout film; represents constant mortal threat"
            }
        ]
    },
    11: {
        "eddie": {
            "state": "Flush with Vernon's cash and NZT supply, transforming lifestyle and appearance completely - new clothes, haircut, fitness routine",
            "transformation": "Uses ill-gotten gains to complete physical transformation; becomes commanding presence; completes book in four days",
            "psychologicalState": "'A tablet a day kept the torpor away. And what I could do with my day...was limitless.' - feels invincible; believes he can master anything"
        },
        "otherCharacters": []
    },
    12: {
        "eddie": {
            "state": "Socially dominant on NZT - commanding presence in bars, fluent in multiple languages, seducing women effortlessly",
            "transformation": "No longer invisible failure but magnetic center of attention; 'fish in a barrel' with women; speaks French fluently to European crowd",
            "psychologicalState": "Confident, playful, intellectually dominant; discovers transformation works better with strangers than family who remember old Eddie"
        },
        "otherCharacters": [
            {
                "name": "Beautiful Woman at Bar",
                "role": "Intellectual sparring partner and sexual conquest",
                "relationshipDynamics": "Initially confident in debate, Eddie completely disarms her intellectually and seductively; represents Eddie's new sexual prowess",
                "characterArcMoment": "Shows Eddie can dominate any social or intellectual interaction; has sex in bar bathroom"
            },
            {
                "name": "Eddie's Parents",
                "role": "Working class parents confused by Eddie's transformation",
                "relationshipDynamics": "Can't understand Eddie's financial advice or rapid change; Eddie quickly realizes transformation doesn't translate to people who knew old him",
                "characterArcMoment": "Reveals limitation: enhanced Eddie alienates those who remember baseline Eddie"
            },
            {
                "name": "Kevin Doyle",
                "role": "Well-dressed broker impressed by Eddie's financial analysis",
                "relationshipDynamics": "Initially skeptical, becomes convinced by Eddie's historical/psychological analysis of market behavior",
                "characterArcMoment": "First contact with financial world that will become Eddie's next arena; 'Hey, I want in on it!'"
            }
        ]
    },
    13: {
        "eddie": {
            "state": "Discovers NZT's dark side - mysterious time loss, waking in unfamiliar places with no memory, evidence of violence",
            "transformation": "First major consequence: NZT can cause blackouts where enhanced Eddie does things baseline Eddie doesn't remember",
            "psychologicalState": "Terror at loss of control; finds blood on clothes, doesn't know if he hurt someone; realizes drug has serious dangerous side effects"
        },
        "otherCharacters": [
            {
                "name": "Blonde Hotel Woman",
                "role": "Woman Eddie apparently spent night with during blackout",
                "relationshipDynamics": "Eddie has no memory of her but she acts familiar; evidence of his blackout activities",
                "characterArcMoment": "Represents the unknown consequences of Eddie's blackouts; what else has he done?"
            }
        ]
    },
    14: {
        "eddie": {
            "state": "Decides to enter financial markets to multiply NZT advantages; researching stocks and trading strategies",
            "transformation": "Shifts from writing to finance - realizes NZT's real power is in markets where returns compound exponentially",
            "psychologicalState": "Ambitious, rationalizing past blackouts, focused on wealth accumulation; 'Why write about money when you can make it?'"
        },
        "otherCharacters": []
    },
    15: {
        "eddie": {
            "state": "Starts day trading with borrowed money, turning initial capital into substantial gains through enhanced market prediction",
            "transformation": "Proves NZT works in financial markets; can process patterns, news, psychology simultaneously to predict movements",
            "psychologicalState": "Exhilarated by success, addicted to winning; confidence approaching hubris; believes he's found the perfect application for NZT"
        },
        "otherCharacters": [
            {
                "name": "Kevin Doyle",
                "role": "Broker who lends Eddie initial trading capital",
                "relationshipDynamics": "Impressed enough by Eddie to front him money; becomes believer in Eddie's abilities",
                "characterArcMoment": "Enables Eddie's entry into high finance; represents Eddie's bridge to bigger money"
            }
        ]
    },
    16: {
        "eddie": {
            "state": "Reconnects with Lindy to show off transformation and success; wants her to see what he's become",
            "transformation": "Tests whether transformation can win back what he lost; still cares about Lindy's validation",
            "psychologicalState": "Mix of genuine affection and ego - wants to prove she was wrong to leave him; needs her to witness his success"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Ex-girlfriend seeing transformed Eddie for first time",
                "relationshipDynamics": "Shocked by physical and behavioral change; suspicious and intrigued; 'What happened to you?' echoes publisher's reaction",
                "characterArcMoment": "Reintroduced to transformed Eddie; torn between skepticism and attraction; senses something artificial about change"
            }
        ]
    },
    17: {
        "eddie": {
            "state": "Dating Lindy again, trying to maintain relationship while hiding NZT use; juggling increasing demands",
            "transformation": "Attempting normal relationship while fundamentally changed; keeping secret from closest person",
            "psychologicalState": "Deceptive but believes he's protecting her; compartmentalizing life into NZT and non-NZT zones; relationship feels like test of whether he can have both power and love"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Girlfriend cautiously optimistic about Eddie's changes",
                "relationshipDynamics": "Wants to believe in Eddie but notices inconsistencies; loving but watchful; represents normal life Eddie is leaving behind",
                "characterArcMoment": "Growing closer to Eddie while he grows more secretive; foundation of trust built on his deception"
            }
        ]
    },
    18: {
        "eddie": {
            "state": "Massive financial success attracts attention from billionaire Carl Van Loon who wants to meet",
            "transformation": "Success escalating beyond Eddie's initial dreams; entering world of true power and wealth",
            "psychologicalState": "Excited but wary; realizes he's playing in bigger leagues now; Van Loon represents opportunity and danger"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Billionaire corporate raider interested in Eddie's financial genius",
                "relationshipDynamics": "Powerful figure who sees Eddie as potential asset; testing Eddie's abilities; represents seduction of true power",
                "characterArcMoment": "Introduction as sophisticated predator who wants to use Eddie's gifts for massive corporate merger"
            }
        ]
    },
    19: {
        "eddie": {
            "state": "Meeting with Van Loon, demonstrating enhanced analytical abilities about merger deal",
            "transformation": "Proves himself to most powerful figure he's ever encountered; Van Loon impressed enough to want partnership",
            "psychologicalState": "Performing at highest level; intellectually dominant even with billionaire; feels he's arrived at pinnacle"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Billionaire testing and recruiting Eddie",
                "relationshipDynamics": "Initially skeptical, becomes convinced of Eddie's genius; offers consulting role on major merger",
                "characterArcMoment": "Decides to bring Eddie into his inner circle for crucial business deal; recognizes something special but doesn't know about NZT"
            }
        ]
    },
    20: {
        "eddie": {
            "state": "Blonde Man confronts Eddie violently, demanding to know where Vernon's NZT stash is",
            "transformation": "Mortal threat becomes immediate and personal; must use enhanced intelligence to survive physical violence",
            "psychologicalState": "Terrified but thinking fast; realizes he must fight or die; NZT helps him recall martial arts and strategy"
        },
        "otherCharacters": [
            {
                "name": "The Blonde Man",
                "role": "Violent enforcer confronting Eddie about NZT location",
                "relationshipDynamics": "Physically overpowering Eddie, demands pills; willing to kill for NZT supply",
                "characterArcMoment": "Threat escalates from surveillance to violence; establishes he'll kill Eddie if necessary"
            }
        ]
    },
    21: {
        "eddie": {
            "state": "Fights back using NZT-enhanced recall of martial arts, environmental awareness, and strategy",
            "transformation": "Discovers NZT makes him physically capable in crisis; survives deadly encounter through enhanced processing",
            "psychologicalState": "Operating on pure survival instinct enhanced by NZT; kills or severely wounds Blonde Man in self-defense"
        },
        "otherCharacters": [
            {
                "name": "The Blonde Man",
                "role": "Attacker whom Eddie defeats using enhanced abilities",
                "relationshipDynamics": "Eddie outsmarts and overpowers him using environment and recalled techniques",
                "characterArcMoment": "Defeated but establishes Eddie capable of violence when necessary; may survive to return"
            }
        ]
    },
    22: {
        "eddie": {
            "state": "Shaken by violence but continuing with Van Loon deal; compartmentalizing trauma to maintain success",
            "transformation": "Becoming harder, more ruthless; violence doesn't stop his ambition, just makes him more cautious",
            "psychologicalState": "Suppressing fear and guilt; justifying everything as self-defense; believes he can manage all threats"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Client demanding Eddie's focus on crucial merger",
                "relationshipDynamics": "Unaware of Eddie's other problems; expects total commitment to deal",
                "characterArcMoment": "Represents legitimate success Eddie is trying to protect while managing illegal/dangerous NZT situation"
            }
        ]
    },
    23: {
        "eddie": {
            "state": "NZT supply concerns growing; realizes 500 pills won't last forever at daily dose",
            "transformation": "Success threatened by limited supply; begins thinking about long-term sustainability",
            "psychologicalState": "Anxiety about running out; considers rationing vs. finding new source; dependency fully established"
        },
        "otherCharacters": []
    },
    24: {
        "eddie": {
            "state": "Experiments with dosage adjustments, discovers withdrawal symptoms even with taper",
            "transformation": "Learns he's physically addicted; even small reductions cause cognitive decline and physical symptoms",
            "psychologicalState": "Trapped by addiction; realizes he may never be able to stop without severe consequences"
        },
        "otherCharacters": []
    },
    25: {
        "eddie": {
            "state": "Uses Vernon's address book to track down NZT sources, entering dangerous underground network",
            "transformation": "Becomes player in drug underworld; must navigate dealers and addicts to secure supply",
            "psychologicalState": "Desperation overriding caution; willing to take risks to maintain supply; sees it as survival necessity"
        },
        "otherCharacters": [
            {
                "name": "Underground NZT Dealers",
                "role": "Dangerous contacts from Vernon's network",
                "relationshipDynamics": "Suspicious of Eddie, demand high prices, represent seedy underbelly of NZT trade",
                "characterArcMoment": "Show Eddie that NZT network is extensive, dangerous, and that he's just one player among many"
            }
        ]
    },
    26: {
        "eddie": {
            "state": "Discovers other NZT users including scientists trying to reverse-engineer the drug",
            "transformation": "Realizes NZT problem is bigger than him; others also dependent, seeking solutions",
            "psychologicalState": "Brief hope that pharmaceutical solution exists; considers trying to manufacture his own supply"
        },
        "otherCharacters": [
            {
                "name": "Other NZT Users",
                "role": "Fellow addicts with various approaches to supply problem",
                "relationshipDynamics": "Some cooperative, some competitive; all desperate in their own way",
                "characterArcMoment": "Establish that Eddie isn't unique; many others dependent on NZT with varying success managing it"
            }
        ]
    },
    27: {
        "eddie": {
            "state": "Russian mobster Gennady learns about Eddie's abilities and NZT, wants partnership/control",
            "transformation": "New threat emerges: organized crime interested in Eddie's gifts and drug source",
            "psychologicalState": "Caught between Van Loon's legitimate world and Gennady's criminal underworld; feeling walls closing in"
        },
        "otherCharacters": [
            {
                "name": "Gennady",
                "role": "Russian mobster who discovers Eddie's secret",
                "relationshipDynamics": "Threatening figure who sees Eddie as resource to exploit; offers protection for partnership meaning control",
                "characterArcMoment": "Introduction as sophisticated criminal threat; wants to use Eddie's abilities for his own purposes"
            }
        ]
    },
    28: {
        "eddie": {
            "state": "Trying to juggle Van Loon's merger, Gennady's demands, supply issues, and keeping secrets from Lindy",
            "transformation": "Success becoming burden; multiple threats converging; enhanced mind struggling to manage all variables",
            "psychologicalState": "Stressed, paranoid, feeling control slipping; still believes he can think his way out through superior intelligence"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Demanding boss expecting results on merger",
                "relationshipDynamics": "Increasing pressure for Eddie to deliver; unaware of competing demands on Eddie",
                "characterArcMoment": "Represents legitimate success that's threatened by Eddie's other entanglements"
            },
            {
                "name": "Gennady",
                "role": "Crime boss applying pressure for cooperation",
                "relationshipDynamics": "Increasing threats and surveillance; making clear refusal isn't option",
                "characterArcMoment": "Escalates from interest to ownership mindset about Eddie"
            },
            {
                "name": "Lindy",
                "role": "Girlfriend sensing something seriously wrong with Eddie",
                "relationshipDynamics": "Growing concerned about Eddie's behavior, stress, secrecy; wants to help but Eddie won't let her in",
                "characterArcMoment": "Love tested by Eddie's secrets; wants to trust him but evidence mounting that something is very wrong"
            }
        ]
    },
    29: {
        "eddie": {
            "state": "Another blackout episode leads to missing time and evidence Eddie may have hurt someone",
            "transformation": "NZT side effects worsening under stress; losing time and control more frequently",
            "psychologicalState": "Terror at what he might have done during blackout; guilt and fear mixing; wondering if drug is destroying him"
        },
        "otherCharacters": []
    },
    30: {
        "eddie": {
            "state": "Police investigating incident from Eddie's blackout; Eddie has no memory to defend himself",
            "transformation": "Legal consequences emerging; NZT's blackouts create vulnerability to prosecution",
            "psychologicalState": "Terrified of going to prison for something he doesn't remember; using enhanced intelligence to navigate interrogation"
        },
        "otherCharacters": [
            {
                "name": "Detective",
                "role": "Cop investigating Eddie's possible involvement in violence",
                "relationshipDynamics": "Suspicious of Eddie's story and behavior; evidence points toward Eddie",
                "characterArcMoment": "Represents legal system as threat Eddie can't simply think his way past"
            }
        ]
    },
    31: {
        "eddie": {
            "state": "Lindy discovers Eddie's NZT pills, demands truth about what he's taking",
            "transformation": "Secret exposed to person whose opinion matters most; must decide whether to trust Lindy with truth",
            "psychologicalState": "Defensive, then desperate; wants Lindy to understand but knows truth sounds insane; fears losing her again"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Girlfriend confronting Eddie about drug use",
                "relationshipDynamics": "Angry, betrayed, frightened for Eddie; thought they were rebuilding trust; wants explanation that makes sense",
                "characterArcMoment": "Discovers Eddie's entire transformation built on drug use; must decide if she can accept this"
            }
        ]
    },
    32: {
        "eddie": {
            "state": "Explains NZT to Lindy, demonstrates what it does, tries to justify his use",
            "transformation": "Vulnerability in admitting complete dependence; revealing how much is artificial vs. real",
            "psychologicalState": "Mix of pride in accomplishments and shame at dependency; desperate for Lindy's understanding and acceptance"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Partner grappling with Eddie's revelation",
                "relationshipDynamics": "Torn between love and fear; sees both the benefits and terrible costs of NZT; worried Eddie is destroying himself",
                "characterArcMoment": "Chooses to stay with Eddie despite drugs; decides to help him manage rather than abandon him"
            }
        ]
    },
    33: {
        "eddie": {
            "state": "Working with Lindy as partner who knows truth; slight relief from not hiding but increased worry about her safety",
            "transformation": "No longer alone in NZT struggle; has ally who understands full situation",
            "psychologicalState": "Grateful for support but guilty about dragging Lindy into danger; protective but also dependent on her help"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Partner now actively helping Eddie manage NZT complications",
                "relationshipDynamics": "Committed to helping Eddie survive and find solution; pragmatic about immediate dangers",
                "characterArcMoment": "Evolution from girlfriend to full partner in crisis; eyes open to dangers but choosing to stay"
            }
        ]
    },
    34: {
        "eddie": {
            "state": "Van Loon's merger reaching critical point; Eddie must perform at peak while health declining",
            "transformation": "Physical toll of NZT becoming visible; enhanced mind in deteriorating body",
            "psychologicalState": "Pushing through pain and symptoms to maintain performance; knows he's running out of time"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Boss depending on Eddie for crucial deal",
                "relationshipDynamics": "Noticing Eddie seems unwell but needs him for merger; pragmatic about using Eddie's abilities",
                "characterArcMoment": "Invests more in Eddie even as Eddie becomes less reliable; has too much riding on Eddie's success"
            }
        ]
    },
    35: {
        "eddie": {
            "state": "Gennady kidnaps Lindy to force Eddie's cooperation and control",
            "transformation": "Worst fear realized: his choices directly endanger Lindy; must rescue her while managing other crises",
            "psychologicalState": "Focused rage and terror; enhanced intelligence entirely devoted to getting Lindy back safely"
        },
        "otherCharacters": [
            {
                "name": "Gennady",
                "role": "Villain holding Lindy hostage to control Eddie",
                "relationshipDynamics": "Uses Lindy as leverage; demonstrates ruthlessness and that Eddie isn't smart enough to escape his grasp",
                "characterArcMoment": "Escalates from threat to action; shows consequences of Eddie's involvement in criminal world"
            },
            {
                "name": "Lindy",
                "role": "Hostage because of Eddie's choices",
                "relationshipDynamics": "Endangered by loving Eddie; becomes bargaining chip in criminal power play",
                "characterArcMoment": "Worst consequence of being with Eddie; tests whether love survives life-threatening danger"
            }
        ]
    },
    36: {
        "eddie": {
            "state": "Supply critically low, experiencing severe withdrawal symptoms; must rescue Lindy while compromised",
            "transformation": "Facing final crisis at weakest point; must succeed without full NZT enhancement",
            "psychologicalState": "Desperate determination; realizes he may need to make ultimate sacrifice; love for Lindy overriding self-preservation"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Captive who must survive on her own wits",
                "relationshipDynamics": "Can't wait for Eddie to save her; must be active participant in own survival",
                "characterArcMoment": "Transforms from protected girlfriend to active fighter; proves her own strength"
            }
        ]
    },
    37: {
        "eddie": {
            "state": "Gives Lindy his last NZT pill to help her escape/survive immediate threat",
            "transformation": "Ultimate selfless act; sacrifices his enhancement and potentially his life to save her",
            "psychologicalState": "Clear-headed about what matters most; chooses Lindy over power; defining character moment"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Forced to take NZT to survive immediate threat",
                "relationshipDynamics": "Experiences what Eddie has been living; understands both the power and the cost firsthand",
                "characterArcMoment": "Takes NZT under duress; uses enhancement to escape Gennady's men; sees both sides of Eddie's life"
            }
        ]
    },
    38: {
        "eddie": {
            "state": "Without NZT, baseline Eddie must use residual knowledge and natural intelligence to continue",
            "transformation": "Discovers that some of NZT's effects persist; he's retained some learning and capability",
            "psychologicalState": "Surprised to find he's not completely back to old Eddie; some growth was real, not just drug-induced"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Partner who now understands NZT from experience",
                "relationshipDynamics": "United by shared experience; both know what NZT does and costs; deeper bond from mutual understanding",
                "characterArcMoment": "Comes down from NZT with empathy for Eddie's addiction and appreciation for his struggle"
            }
        ]
    },
    39: {
        "eddie": {
            "state": "Confronts Gennady using intelligence, preparation, and leverage without NZT enhancement",
            "transformation": "Proves he can be formidable even without drugs; growth through adversity was partially real",
            "psychologicalState": "Confident in what he's become; realizes enhancement helped unlock potential that remains even without pills"
        },
        "otherCharacters": [
            {
                "name": "Gennady",
                "role": "Antagonist who underestimated baseline Eddie",
                "relationshipDynamics": "Expected Eddie to be helpless without NZT; surprised by Eddie's retained capabilities",
                "characterArcMoment": "Defeated by combination of Eddie's preparation and retained intelligence; threat neutralized"
            }
        ]
    },
    40: {
        "eddie": {
            "state": "Completes Van Loon's merger successfully, proving value independent of current NZT use",
            "transformation": "Achieves legitimate success through combination of NZT-acquired knowledge and natural ability",
            "psychologicalState": "Vindicated; realizes he's not just the drug, but drug helped him become who he truly could be"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Satisfied client who sees Eddie as valuable long-term asset",
                "relationshipDynamics": "Impressed enough to want ongoing relationship; sees Eddie as someone special",
                "characterArcMoment": "Offers Eddie bigger role in his empire; validation of Eddie's transformation"
            }
        ]
    },
    41: {
        "eddie": {
            "state": "Researching NZT's chemistry to understand side effects and potential solutions",
            "transformation": "Applying enhanced knowledge to solve his own problem; becoming his own scientist",
            "psychologicalState": "Determined to find way to keep gains without costs; believes intelligence can solve any problem"
        },
        "otherCharacters": []
    },
    42: {
        "eddie": {
            "state": "Discovers method to metabolize NZT more safely, reducing side effects",
            "transformation": "Scientific breakthrough allows sustainable NZT use; solves the addiction/side effect problem",
            "psychologicalState": "Triumphant; believes he's beaten the system; found way to have power without price"
        },
        "otherCharacters": []
    },
    43: {
        "eddie": {
            "state": "On improved NZT protocol, functioning at high level without blackouts or severe withdrawal",
            "transformation": "Stabilized enhancement; found equilibrium between power and health",
            "psychologicalState": "Confident he can maintain this indefinitely; sees future of sustained excellence"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Partner monitoring Eddie's improved condition with cautious optimism",
                "relationshipDynamics": "Relieved Eddie seems healthy but watchful for warning signs; supporting his solution",
                "characterArcMoment": "Sees Eddie apparently solving the NZT problem; hopes they can have normal life"
            }
        ]
    },
    44: {
        "eddie": {
            "state": "Van Loon suspects Eddie's success has chemical component; probes for information",
            "transformation": "Secret threatened by those closest to his success; must protect NZT from exploitation",
            "psychologicalState": "Defensive, secretive; realizes Van Loon wants to control his power source"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Powerful figure who suspects Eddie's secret and wants it",
                "relationshipDynamics": "Shifting from mentor/patron to potential threat; sees Eddie as resource to control or exploit",
                "characterArcMoment": "Reveals predatory side; wants Eddie's secret for his own purposes"
            }
        ]
    },
    45: {
        "eddie": {
            "state": "Prepares defenses against Van Loon's investigation and potential takeover attempts",
            "transformation": "From grateful protégé to independent player protecting his interests",
            "psychologicalState": "Strategic, wary; using enhanced intelligence to outmaneuver former mentor"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Antagonist trying to control or acquire Eddie's capabilities",
                "relationshipDynamics": "Power struggle between billionaire and enhanced genius; battle of resources vs. intelligence",
                "characterArcMoment": "Escalates from curiosity to active attempts to control Eddie"
            }
        ]
    },
    46: {
        "eddie": {
            "state": "Blonde Man returns, having survived earlier encounter; final confrontation imminent",
            "transformation": "Must face unfinished business; original threat returning for resolution",
            "psychologicalState": "Focused on eliminating threat permanently; enhanced strategic thinking for survival"
        },
        "otherCharacters": [
            {
                "name": "The Blonde Man",
                "role": "Returning antagonist for final showdown",
                "relationshipDynamics": "Personal vendetta mixed with professional hunt for NZT; determined to kill Eddie",
                "characterArcMoment": "Returns more dangerous and determined; Eddie must end threat definitively"
            }
        ]
    },
    47: {
        "eddie": {
            "state": "Final confrontation with Blonde Man; uses preparation, intelligence, and environment to survive",
            "transformation": "Proves he can protect himself and eliminate threats decisively",
            "psychologicalState": "Ruthless when necessary; has evolved into someone who can kill to survive"
        },
        "otherCharacters": [
            {
                "name": "The Blonde Man",
                "role": "Threat finally eliminated",
                "relationshipDynamics": "Eddie outsmarts and defeats him definitively",
                "characterArcMoment": "Eliminated as threat; Eddie proves superior intelligence defeats superior force"
            }
        ]
    },
    48: {
        "eddie": {
            "state": "Outmaneuvers Van Loon's attempts to control him through strategic preparation",
            "transformation": "Defeats billionaire's power play through intelligence and planning; fully independent now",
            "psychologicalState": "Triumphant; proved intelligence defeats money and power"
        },
        "otherCharacters": [
            {
                "name": "Carl Van Loon",
                "role": "Defeated adversary who underestimated Eddie",
                "relationshipDynamics": "Eddie outplayed him completely; Van Loon must accept Eddie as equal or superior",
                "characterArcMoment": "Learns Eddie has become something he can't control or predict"
            }
        ]
    },
    49: {
        "eddie": {
            "state": "Running for Senate; leveraging enhanced capabilities for political power",
            "transformation": "Evolution from failed writer to political candidate; using NZT for public service (or ultimate power)",
            "psychologicalState": "Ambitious on largest scale; believes enhanced intelligence qualifies him to lead"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Partner supporting Eddie's political ambitions",
                "relationshipDynamics": "Stands by Eddie through transformation to public figure; concerned about implications",
                "characterArcMoment": "Committed to Eddie despite knowing full truth about NZT and his ambitions"
            },
            {
                "name": "Carl Van Loon",
                "role": "Former adversary now cautious ally or observer",
                "relationshipDynamics": "Wary respect for Eddie's trajectory; watching to see how far he'll go",
                "characterArcMoment": "Realizes Eddie's ambitions extend beyond business to political power"
            }
        ]
    },
    50: {
        "eddie": {
            "state": "Claims to be off NZT but retained all enhancements; ambiguous whether he's telling truth",
            "transformation": "Final state: powerful, successful, enhanced - but unclear if still using or if changes permanent",
            "psychologicalState": "Confident, powerful, enigmatic; has become the person he wanted to be - question is at what ongoing cost"
        },
        "otherCharacters": [
            {
                "name": "Lindy",
                "role": "Partner in Eddie's new life, public and private",
                "relationshipDynamics": "Accepts Eddie as he is; unclear if she believes he's off NZT or if she's complicit in continued use",
                "characterArcMoment": "Final scene establishes their partnership enduring despite all complications; chosen to stay with enhanced Eddie"
            },
            {
                "name": "Carl Van Loon",
                "role": "Former mentor now confronted with Eddie's claim to be off NZT",
                "relationshipDynamics": "Skeptical of Eddie's claims but forced to accept he can't control or predict him",
                "characterArcMoment": "Represents audience skepticism; final ambiguity about whether Eddie really solved NZT problem or is lying"
            }
        ]
    }
}

def main():
    """Main processing function."""
    json_path = '/Users/fermibot/WebstormProjects/fermibotsite/pages/stories/NeilBurger_2011_Limitless/limitless_scenes_50.json'

    print("Loading JSON file...")
    data = load_json(json_path)

    print(f"\nUpdating character development for all {len(data['scenes'])} scenes...")
    updated_count = 0

    for scene in data['scenes']:
        scene_id = scene['id']
        if scene_id in CHARACTER_DEVELOPMENT:
            scene['characterDevelopment'] = CHARACTER_DEVELOPMENT[scene_id]
            updated_count += 1
            print(f"  ✓ Scene {scene_id:2d}: {scene['title']}")
        else:
            print(f"  ✗ Scene {scene_id:2d}: {scene['title']} - NO DATA")

    print(f"\nSaving updated JSON...")
    save_json(json_path, data)

    print(f"\n{'='*70}")
    print(f"COMPLETE! Updated {updated_count} of {len(data['scenes'])} scenes")
    print(f"{'='*70}")

if __name__ == '__main__':
    main()
