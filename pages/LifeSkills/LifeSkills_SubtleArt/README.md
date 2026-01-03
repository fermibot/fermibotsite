# The Subtle Art of Not Giving a F*ck - Interactive Visualization

This page provides an interactive visualization of Mark Manson's book "The Subtle Art of Not Giving a F*ck: A Counterintuitive Approach to Living a Good Life".

## Features

- **Interactive Force-Directed Graph**: Visualizes relationships between concepts, principles, and practices
- **8 Thematic Sections**:
  1. Core Philosophy (💭)
  2. Choosing Your Values (🎯)
  3. Taking Action (⚡)
  4. Key Principles (🔑)
  5. Practical Applications (🛠️)
  6. Mental Models (🧠)
  7. Life Lessons (📖)
  8. Daily Practices (🔄)

- **Search & Filter**: Search concepts by name or content, filter by section
- **Progress Tracking**: Mark concepts as learned, track progress by section
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Adapts to system theme preferences

## Content Sources

Content synthesized from multiple book summaries:
- James Clear's Book Summaries
- Matt Swain's Book Notes
- Graham Mann's Book Notes
- Freedman Newman's Medium Summary
- Dan Lebrero's Summary

## Files

- `LifeSkills_SubtleArt.html` - Main HTML page
- `LifeSkills_SubtleArt.js` - Visualization logic and interactions
- `LifeSkills_SubtleArt.css` - Styles and animations
- `LifeSkills_SubtleArt.json` - Data structure with all concepts

## Usage

1. Open `LifeSkills_SubtleArt.html` in a web browser
2. Hover over nodes to see connections and tooltips
3. Click nodes to see detailed summaries
4. Use the search box to find specific concepts (press `/` to focus)
5. Click section badges to filter by topic
6. Mark concepts as learned to track your progress
7. Your progress is saved in browser localStorage

## Data Structure

The JSON file contains concepts organized as:
- **Chapters** (main.chapter_name.XX): Core book chapters
- **Principles** (main.principle.XX): Key principles
- **Concepts** (main.concept.XX): Mental models
- **Lessons** (main.lesson.XX): Life lessons
- **Practices** (main.practice.XX): Daily actionable habits
- **Sections** (main.section_name.XX): Thematic groupings

Each node has:
- `name`: Unique identifier
- `imports`: Dependencies/connections
- `summary`: Brief explanation of the concept

## Technologies

- D3.js v7 for force-directed graph visualization
- Bootstrap 5 for UI components
- Vanilla JavaScript for interactivity
- localStorage for progress persistence

