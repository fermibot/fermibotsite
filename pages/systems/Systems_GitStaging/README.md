# Git Staging Process Visualization

## Overview
An interactive D3-based visualization that demonstrates the Git staging workflow, showing how files move from the working directory to the staging area and finally to the repository.

## Features

### 1. **Working Directory**
- Shows modified and untracked files (orange border)
- Files start here when changed or created
- Each file displays:
  - File icon based on type (HTML, CSS, JS, JSON, MD)
  - File name
  - Status (Modified or Untracked)
  - "Stage" button to move to staging area

### 2. **Staging Area (Index)**
- Shows files ready to be committed (green border)
- Files staged with `git add` appear here
- Each file displays:
  - File icon and name
  - "Unstage" button to move back to working directory

### 3. **Repository**
- Shows commit history (blue border)
- Each commit displays:
  - Commit hash (7-character hex)
  - Commit message
  - Timestamp
  - List of files included

### 4. **Interactive Controls**

#### Add New Files
- Input field to add custom files
- Automatically detects file type from extension
- Validates duplicate filenames

#### Stage/Unstage Operations
- Click "➕ Stage" to add file to staging area
- Click "➖ Unstage" to remove from staging area
- Smooth animations for visual feedback

#### Commit Staged Files
- Commits all files in staging area
- Generates unique commit hash
- Clears staging area after commit
- Shows commit in repository history

#### Reset Demo
- Clears all changes and resets to initial state
- Requires confirmation

### 5. **Real-time Statistics**
- Working Directory count
- Staging Area count
- Total commits count

## Design Features

### Theme Support
- Full dark/light mode support
- Colors adapt based on Bootstrap theme
- Uses CSS variables for theming

### Color Coding
- **Orange**: Working Directory (files need staging)
- **Green**: Staging Area (files ready to commit)
- **Blue**: Repository (committed changes)

### Animations
- Slide-in animation for new files
- Fade-in animation for commits
- Pulse animation when areas update
- Shake animation for invalid operations
- Hover effects on all interactive elements

### Responsive Design
- 3-column grid on desktop
- 1-column stack on mobile
- Touch-friendly buttons
- Adaptive layout for all screen sizes

## Git Commands Illustrated

### `git add <file>`
Represented by clicking "➕ Stage" button
- Moves file from Working Directory to Staging Area

### `git reset HEAD <file>`
Represented by clicking "➖ Unstage" button
- Moves file from Staging Area back to Working Directory

### `git commit -m "message"`
Represented by clicking "✓ Commit Staged Files" button
- Creates commit with all staged files
- Generates commit hash
- Records timestamp

## Initial Demo Files
1. `index.html` (HTML file, modified)
2. `styles.css` (CSS file, modified)
3. `script.js` (JavaScript file, new)
4. `README.md` (Markdown file, modified)
5. `config.json` (JSON file, new)

## File Type Icons
- 📄 HTML files
- 🎨 CSS files
- ⚡ JavaScript files
- 📋 JSON files
- 📝 Markdown files
- 📁 Other files

## Technical Implementation

### Technologies
- **D3.js v7**: For dynamic DOM manipulation
- **Bootstrap 5**: For responsive layout and styling
- **Vanilla JavaScript**: For state management and interactions
- **CSS Variables**: For theming support

### State Management
All state stored in JavaScript object:
```javascript
{
  workingFiles: [],     // Files in working directory
  stagingFiles: [],     // Files in staging area
  commits: [],          // Commit history
  nextFileId: 1,        // Auto-increment ID
  nextCommitId: 1       // Auto-increment commit ID
}
```

### File Structure
```
pages/systems/Systems_GitStaging/
├── Systems_GitStaging.html    # Main HTML page
├── Systems_GitStaging.css     # Styles
└── Systems_GitStaging.js      # Interactive logic
```

## Usage Tips

1. **Learn Git Workflow**: Use this to understand the three-state Git model
2. **Practice Staging**: Stage individual files or multiple files before committing
3. **Experiment**: Add new files, stage/unstage, see commit history
4. **Visual Learning**: Colors and animations help reinforce concepts

## Educational Value

Perfect for:
- Git beginners learning the staging workflow
- Visual learners who need to see the process
- Teaching Git concepts in workshops
- Understanding the difference between working directory, staging area, and repository

## Browser Compatibility
- Modern browsers with ES6 support
- Chrome, Firefox, Safari, Edge (latest versions)
- Responsive design works on mobile and tablet

---

**Status**: ✅ Complete and functional
**Created**: January 6, 2026
**Theme**: Matches LifeSkills_HowToTalkToAnyone styling

