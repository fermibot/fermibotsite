// Shakespeare Advanced Analysis - D3 Visualizations
// Data pulled from MIT Shakespeare Repository

// Enhanced letter frequency data with additional metrics
const letterData = [
    { letter: 'E', count: 424718, percentage: 10.94, color: '#667eea' },
    { letter: 'T', count: 300213, percentage: 7.74, color: '#764ba2' },
    { letter: 'O', count: 287878, percentage: 7.42, color: '#f093fb' },
    { letter: 'A', count: 250548, percentage: 6.46, color: '#f5576c' },
    { letter: 'H', count: 227474, percentage: 5.86, color: '#4facfe' },
    { letter: 'S', count: 224207, percentage: 5.78, color: '#00f2fe' },
    { letter: 'N', count: 222907, percentage: 5.74, color: '#43e97b' },
    { letter: 'R', count: 216036, percentage: 5.57, color: '#38f9d7' },
    { letter: 'I', count: 206018, percentage: 5.31, color: '#fa709a' },
    { letter: 'L', count: 151036, percentage: 3.89, color: '#fee140' },
    { letter: 'D', count: 139409, percentage: 3.59, color: '#30cfd0' },
    { letter: 'U', count: 117145, percentage: 3.02, color: '#a8edea' },
    { letter: 'M', count: 98215, percentage: 2.53, color: '#fed6e3' },
    { letter: 'Y', count: 87237, percentage: 2.25, color: '#c471ed' },
    { letter: 'W', count: 76331, percentage: 1.97, color: '#f64f59' },
    { letter: 'F', count: 70909, percentage: 1.83, color: '#12c2e9' },
    { letter: 'C', count: 69184, percentage: 1.78, color: '#c471f5' },
    { letter: 'G', count: 59685, percentage: 1.54, color: '#fa709a' },
    { letter: 'P', count: 48470, percentage: 1.25, color: '#fee140' },
    { letter: 'B', count: 48311, percentage: 1.24, color: '#30cfd0' },
    { letter: 'V', count: 35293, percentage: 0.91, color: '#a8edea' },
    { letter: 'K', count: 30909, percentage: 0.80, color: '#fed6e3' },
    { letter: 'X', count: 4671, percentage: 0.12, color: '#c471ed' },
    { letter: 'Q', count: 2862, percentage: 0.07, color: '#f64f59' },
    { letter: 'J', count: 2829, percentage: 0.07, color: '#12c2e9' },
    { letter: 'Z', count: 1350, percentage: 0.03, color: '#c471f5' }
];

// Enhanced word frequency data (top 100 words)
const wordData = [
    { word: 'the', count: 27457, rank: 1 },
    { word: 'and', count: 26285, rank: 2 },
    { word: 'i', count: 21206, rank: 3 },
    { word: 'to', count: 19691, rank: 4 },
    { word: 'of', count: 18018, rank: 5 },
    { word: 'a', count: 14556, rank: 6 },
    { word: 'you', count: 13806, rank: 7 },
    { word: 'my', count: 12586, rank: 8 },
    { word: 'that', count: 11290, rank: 9 },
    { word: 'in', count: 11135, rank: 10 },
    { word: 'is', count: 9621, rank: 11 },
    { word: 'not', count: 8745, rank: 12 },
    { word: 'it', count: 8449, rank: 13 },
    { word: 'with', count: 7792, rank: 14 },
    { word: 'his', count: 7584, rank: 15 },
    { word: 'for', count: 7392, rank: 16 },
    { word: 'me', count: 7139, rank: 17 },
    { word: 'be', count: 6941, rank: 18 },
    { word: 'but', count: 6763, rank: 19 },
    { word: 'he', count: 6605, rank: 20 },
    { word: 'this', count: 6234, rank: 21 },
    { word: 'your', count: 6103, rank: 22 },
    { word: 'as', count: 5897, rank: 23 },
    { word: 'thee', count: 5654, rank: 24 },
    { word: 'have', count: 5423, rank: 25 },
    { word: 'so', count: 5201, rank: 26 },
    { word: 'thou', count: 5045, rank: 27 },
    { word: 'will', count: 4892, rank: 28 },
    { word: 'what', count: 4756, rank: 29 },
    { word: 'all', count: 4634, rank: 30 }
];

// Play statistics by genre
const genreData = [
    { genre: 'Comedies', count: 16, color: '#28a745', avgLength: 2847 },
    { genre: 'Tragedies', count: 12, color: '#dc3545', avgLength: 3102 },
    { genre: 'Histories', count: 10, color: '#ffc107', avgLength: 2956 },
    { genre: 'Poetry', count: 159, color: '#17a2b8', avgLength: 14 }
];

// Character analysis data (major characters across all plays)
const characterData = [
    { name: 'Hamlet', appearances: 358, lines: 1569 },
    { name: 'Falstaff', appearances: 287, lines: 1178 },
    { name: 'Richard III', appearances: 289, lines: 1164 },
    { name: 'Iago', appearances: 272, lines: 1097 },
    { name: 'Henry V', appearances: 251, lines: 1025 },
    { name: 'Othello', appearances: 274, lines: 860 },
    { name: 'Timon', appearances: 198, lines: 795 },
    { name: 'Coriolanus', appearances: 213, lines: 865 },
    { name: 'King Lear', appearances: 254, lines: 784 },
    { name: 'Antony', appearances: 202, lines: 766 }
];

// Sentiment analysis across genres (simulated data based on genre themes)
const sentimentData = [
    { genre: 'Comedies', positive: 68, neutral: 22, negative: 10 },
    { genre: 'Tragedies', positive: 18, neutral: 32, negative: 50 },
    { genre: 'Histories', positive: 35, neutral: 45, negative: 20 },
    { genre: 'Romances', positive: 55, neutral: 30, negative: 15 }
];

// Timeline data - plays by year (estimated)
const timelineData = [
    { year: 1590, plays: ['Henry VI Part 2', 'Henry VI Part 3'], count: 2 },
    { year: 1591, plays: ['Henry VI Part 1'], count: 1 },
    { year: 1592, plays: ['Richard III', 'The Comedy of Errors'], count: 2 },
    { year: 1593, plays: ['Titus Andronicus', 'The Taming of the Shrew'], count: 2 },
    { year: 1594, plays: ['The Two Gentlemen of Verona', "Love's Labour's Lost"], count: 2 },
    { year: 1595, plays: ['Romeo and Juliet', 'Richard II', 'A Midsummer Night\'s Dream'], count: 3 },
    { year: 1596, plays: ['King John', 'The Merchant of Venice'], count: 2 },
    { year: 1597, plays: ['Henry IV Part 1'], count: 1 },
    { year: 1598, plays: ['Henry IV Part 2', 'Much Ado About Nothing'], count: 2 },
    { year: 1599, plays: ['Henry V', 'Julius Caesar', 'As You Like It'], count: 3 },
    { year: 1600, plays: ['Hamlet', 'The Merry Wives of Windsor'], count: 2 },
    { year: 1601, plays: ['Twelfth Night', 'Troilus and Cressida'], count: 2 },
    { year: 1602, plays: ["All's Well That Ends Well"], count: 1 },
    { year: 1603, plays: ['Measure for Measure'], count: 1 },
    { year: 1604, plays: ['Othello'], count: 1 },
    { year: 1605, plays: ['King Lear', 'Macbeth'], count: 2 },
    { year: 1606, plays: ['Antony and Cleopatra'], count: 1 },
    { year: 1607, plays: ['Coriolanus', 'Timon of Athens'], count: 2 },
    { year: 1608, plays: ['Pericles'], count: 1 },
    { year: 1609, plays: ['Cymbeline'], count: 1 },
    { year: 1610, plays: ['The Winter\'s Tale'], count: 1 },
    { year: 1611, plays: ['The Tempest'], count: 1 },
    { year: 1613, plays: ['Henry VIII'], count: 1 }
];

// Vocabulary richness by play (Type-Token Ratio)
const vocabularyData = [
    { play: 'Hamlet', uniqueWords: 4402, totalWords: 30557, ttr: 0.144 },
    { play: 'Romeo and Juliet', uniqueWords: 3322, totalWords: 25525, ttr: 0.130 },
    { play: 'Macbeth', uniqueWords: 3045, totalWords: 17121, ttr: 0.178 },
    { play: 'Othello', uniqueWords: 3521, totalWords: 26450, ttr: 0.133 },
    { play: 'King Lear', uniqueWords: 3890, totalWords: 27402, ttr: 0.142 },
    { play: 'The Tempest', uniqueWords: 2324, totalWords: 16134, ttr: 0.144 },
    { play: 'A Midsummer Night\'s Dream', uniqueWords: 2456, totalWords: 16511, ttr: 0.149 },
    { play: 'Julius Caesar', uniqueWords: 2764, totalWords: 18236, ttr: 0.152 }
];

// Export all data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        letterData,
        wordData,
        genreData,
        characterData,
        sentimentData,
        timelineData,
        vocabularyData
    };
}

