# Systems_Git Beta - Real Git Engine

**Created:** January 7, 2026  
**Technology:** isomorphic-git + LightningFS  
**Type:** Real in-memory Git implementation

---

## 🚀 Overview

Systems_GitBeta is a **real Git implementation running entirely in the browser** using:

- **isomorphic-git**: Pure JavaScript implementation of Git
- **LightningFS**: In-memory filesystem (IndexedDB backed)
- **D3.js**: Network graph visualization

---

## ✨ Features

### Layout
- **Two users side-by-side** (Alice & Bob) on the left half
- **Remote repository** on the right half (always visible)
- **Local network graphs** per user
- **Remote network graph** showing only PUSHED commits

### Git Operations
- ✅ Create, modify, delete files
- ✅ git add (stage files)
- ✅ git commit (with messages)
- ✅ git branch (create branches)
- ✅ git checkout (switch branches) - **NEW UI**
- ✅ git branch -d (delete branches) - **NEW UI**
- ✅ git merge (merge branches)
- ✅ git push (to remote)
- ✅ git pull (from remote)

### Branch UI
- Click branch name to switch
- Click × to delete branch
- Click "+ New" to create branch
- Active branch highlighted in green

### Network Diagram
- **Unified algorithm** for both local and remote
- Commits sorted by timestamp (oldest at top)
- Arrows point from child → parent (newer → older)
- Branch labels at top (blue=main, green=features)
- Click nodes for commit details
- Compact modal with smaller fonts

### Commit Details Modal
- Compact size (380px max)
- Smaller fonts for better fit
- SHA, Author, Branch, Date, Parents, Message

---

## 🔄 Key Behaviors

| Action | What Happens |
|--------|--------------|
| **Commit** | Creates commit in LOCAL repo with unique SHA |
| **Push** | Sends commits to remote (merges with existing) |
| **Pull** | Gets remote commits (SAME SHAs), adds to local history |
| **Reset All** | Creates fresh filesystem, clears everything |

### Understanding Commit Hashes (UNIFIED)

Now commits are properly unified across users:

1. **Alice commits** → Creates SHA `abc1234`
2. **Alice pushes** → Remote stores commit `abc1234`
3. **Bob pulls** → Bob gets commit `abc1234` (SAME SHA!)
4. **Bob's graph** → Shows Alice's `abc1234` (pink color)
5. **Bob commits** → Creates SHA `xyz5678`
6. **Bob pushes** → Remote has BOTH `abc1234` and `xyz5678`
7. **Alice pulls** → Alice gets Bob's `xyz5678` (SAME SHA!)

**Colors in graphs:**
- Each commit shows the ORIGINAL author's color
- Pink = Alice's commits (even in Bob's graph after pull)
- Blue = Bob's commits (even in Alice's graph after pull)

---

## 📊 Graph Order

- **Top** = Oldest commit (initial)
- **Bottom** = Newest commit
- **Arrows** = Point UP from child to parent

---

## 🎮 Usage

1. **Add Files**: Type filename, click "Add"
2. **Stage**: Click "+Stage" button
3. **Commit**: Click "Commit" button, enter message
4. **Switch Branch**: Click branch name in branch list
5. **Create Branch**: Click "+ New" in branch section
6. **Delete Branch**: Click red × next to branch name (not available for main or current branch)
7. **Merge Branch**: 
   - First, switch to the TARGET branch (where you want changes to go)
   - Click "Merge", then type the SOURCE branch name
   - Example: On `main`, merge `feature` → feature's changes go into main
8. **Push**: Click "Push" to push to remote
9. **Pull**: Click "Pull" to get remote changes

---

**End of Documentation**
