// ============================================
// GIT VERSION CONTROL VISUALIZATION
// Two-Section Demo: Init & Regular Workflow
// ============================================

(function() {
    'use strict';

    // State management
    let state = {
        // Section 1: Init workflow
        initFiles: [],
        initGitInitialized: false,
        initStaged: false,
        initCommitted: false,

        // Section 2: Regular workflow
        workingFiles: [], // legacy list (main branch)
        stagingFiles: [],
        commits: [],
        remoteCommits: [],

        // Branches
        branches: ['main'],
        currentBranch: 'main',

        // Per-branch working/remote directories
        workingDirs: { main: [] },
        remoteDirs: { main: new Set() },
        trackedDirs: { main: new Set() },
        trackedFiles: { main: [] },

        // IDs
        nextFileId: 1,
        nextCommitId: 1
    };

    // File type icons
    const fileIcons = {
        html: '📄',
        css: '🎨',
        js: '⚡',
        json: '📋',
        md: '📝',
        txt: '📃',
        default: '📁'
    };

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        render();
    });

    function setupEventListeners() {
        // Section 1: Init workflow
        document.getElementById('add-init-file-btn').addEventListener('click', addInitFile);
        document.getElementById('init-file-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addInitFile();
        });
        document.getElementById('git-init-btn').addEventListener('click', runGitInit);
        document.getElementById('git-add-init-btn').addEventListener('click', gitAddInit);
        document.getElementById('first-commit-btn').addEventListener('click', makeFirstCommit);

        // Section 2: Regular workflow
        document.getElementById('add-file-btn').addEventListener('click', addWorkingFile);
        document.getElementById('new-file-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addWorkingFile();
        });
        document.getElementById('commit-btn').addEventListener('click', commitStagedFiles);
        document.getElementById('push-btn').addEventListener('click', pushToRemote);

        // Branch operations
        document.getElementById('create-branch-btn').addEventListener('click', createBranch);
        document.getElementById('new-branch-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') createBranch();
        });
        document.getElementById('merge-branch-btn').addEventListener('click', mergeBranch);

        // Branch selects change
        document.getElementById('merge-source').addEventListener('change', validateMergeSelection);
        document.getElementById('merge-target').addEventListener('change', validateMergeSelection);

        // Reset
        document.getElementById('reset-btn').addEventListener('click', resetDemo);
    }

    // ============================================
    // SECTION 1: INIT WORKFLOW
    // ============================================

    function addInitFile() {
        const input = document.getElementById('init-file-name');
        const filename = input.value.trim();

        if (state.initCommitted) {
            alert('Section 1 is complete. Use Section 2 for further changes.');
            return;
        }

        if (!filename) {
            alert('Please enter a filename');
            return;
        }

        const exists = state.initFiles.some(f => f.name.toLowerCase() === filename.toLowerCase());
        if (exists) {
            alert('That file already exists in the empty directory');
            return;
        }

        const ext = filename.split('.').pop().toLowerCase();
        const type = ['html', 'css', 'js', 'json', 'md', 'txt'].includes(ext) ? ext : 'default';

        state.initFiles.push({
            id: state.nextFileId++,
            name: filename,
            type: type,
            status: 'new'
        });

        // If we add a new file after git add, require staging again
        state.initStaged = false;

        input.value = '';
        render();
    }

    function runGitInit() {
        if (state.initCommitted) {
            alert('Section 1 is complete. Use Section 2 for further changes.');
            return;
        }

        if (state.initFiles.length === 0) {
            alert('Add at least one file before running git init');
            return;
        }

        state.initGitInitialized = true;
        animateArea('init-working-files', 'pulse-animation');
        render();
    }

    function gitAddInit() {
        if (state.initCommitted) {
            alert('Section 1 is complete. Use Section 2 for further changes.');
            return;
        }

        if (!state.initGitInitialized) {
            alert('Run git init first');
            return;
        }

        state.initStaged = true;
        // DO NOT seed trackedFiles/workingDirs here - wait for commit
        animateArea('init-staging-files', 'pulse-animation');
        render();
    }

    function makeFirstCommit() {
        if (!state.initStaged) {
            alert('Stage files first (git add .)');
            return;
        }

        const commit = {
            id: state.nextCommitId++,
            hash: generateCommitHash(),
            message: 'Initial commit',
            files: state.initFiles.map(f => f.name),
            date: new Date().toLocaleString(),
            timestamp: Date.now(),
            pushed: false,
            isInitialCommit: true,
            branch: 'main',
            parentId: null
        };

        state.commits.push(commit);
        state.initCommitted = true;

        // NOW seed the tracked files for main branch (only once, here)
        state.trackedFiles['main'] = state.initFiles.map(f => ({
            id: state.nextFileId++,
            name: f.name,
            type: f.type,
            status: 'clean'
        }));

        // Seed the tracked set
        state.trackedDirs['main'] = new Set(state.initFiles.map(f => f.name));

        // Clear workingDirs - will be rebuilt from trackedFiles on render
        state.workingDirs['main'] = [];

        animateArea('init-commits-container', 'pulse-animation');
        animateArea('commit-graph-container', 'pulse-animation');

        render();
    }

    // ============================================
    // SECTION 2: REGULAR WORKFLOW
    // ============================================

    function addWorkingFile() {
        const input = document.getElementById('new-file-name');
        const filename = input.value.trim();

        if (!filename) {
            alert('Please enter a filename');
            return;
        }

        if (!state.initCommitted) {
            alert('Complete Section 1 (Git initialization) first');
            return;
        }

        const currentDir = state.workingDirs[state.currentBranch] || [];
        const allNamesLower = currentDir.map(f => f.name.toLowerCase())
            .concat((state.trackedFiles[state.currentBranch] || []).map(f => f.name.toLowerCase()));
        if (allNamesLower.includes(filename.toLowerCase())) {
            alert('A file with this name already exists on this branch');
            return;
        }

        const ext = filename.split('.').pop().toLowerCase();
        const type = ['html', 'css', 'js', 'json', 'md', 'txt'].includes(ext) ? ext : 'default';

        const fileObj = {
            id: state.nextFileId++,
            name: filename,
            type: type,
            status: 'new'
        };

        currentDir.push(fileObj);
        state.workingDirs[state.currentBranch] = currentDir;
        // Also register in tracked files as new (preserve id)
        state.trackedFiles[state.currentBranch] = mergeTrackedFiles(state.trackedFiles[state.currentBranch] || [], [{ id: fileObj.id, name: filename, type, status: 'new' }], state);

        input.value = '';
        render();
    }

    function stageFile(identifier) {
        const currentDir = state.workingDirs[state.currentBranch] || [];
        let idx = currentDir.findIndex(f => f.id === identifier);
        if (idx === -1) idx = currentDir.findIndex(f => f.name === identifier);
        let file = null;
        if (idx !== -1) {
            file = currentDir.splice(idx, 1)[0];
        }
        const trackedList = state.trackedFiles[state.currentBranch] || [];
        const tracked = trackedList.find(f => f.name === (file ? file.name : identifier));
        if (!file && tracked) {
            file = { ...tracked };
        }
        if (!file) return;
        // Allow staging for modified, new, or deleted files
        if (tracked && tracked.status !== 'modified' && tracked.status !== 'new' && tracked.status !== 'deleted') {
            alert('Modify the file before staging');
            return;
        }
        if (state.stagingFiles.some(f => f.name === file.name)) {
            alert('This file is already staged');
            return;
        }
        state.stagingFiles.push(tracked ? { ...tracked } : file);
        state.workingDirs[state.currentBranch] = currentDir;

        animateArea('staging-files', 'pulse-animation');
        render();
    }

    function unstageFile(fileId) {
        const fileIndex = state.stagingFiles.findIndex(f => f.id === fileId);
        if (fileIndex === -1) return;

        const file = state.stagingFiles.splice(fileIndex, 1)[0];
        const currentDir = state.workingDirs[state.currentBranch] || [];
        currentDir.push(file);
        state.workingDirs[state.currentBranch] = currentDir;

        animateArea('working-files', 'pulse-animation');
        render();
    }

    function modifyFile(fileName) {
        const list = state.trackedFiles[state.currentBranch] || [];
        const item = list.find(f => f.name === fileName);
        if (!item) return;
        item.status = 'modified';
        // Ensure it appears in working dir list for staging
        const working = state.workingDirs[state.currentBranch] || [];
        const exists = working.find(f => f.name === fileName);
        if (!exists) {
            working.push({ id: item.id, name: fileName, type: item.type, status: 'modified' });
        } else {
            exists.status = 'modified';
            exists.type = item.type;
        }
        state.workingDirs[state.currentBranch] = working;
        render();
    }

    function deleteFile(fileName) {
        const tracked = state.trackedFiles[state.currentBranch] || [];
        const target = tracked.find(f => f.name === fileName);

        if (!target) return;

        // Mark file as deleted (don't remove yet - needs to be staged and committed)
        target.status = 'deleted';

        // Ensure it appears in working dir list for staging the deletion
        const working = state.workingDirs[state.currentBranch] || [];
        const exists = working.find(f => f.name === fileName);
        if (!exists) {
            working.push({ id: target.id, name: fileName, type: target.type, status: 'deleted' });
        } else {
            exists.status = 'deleted';
        }
        state.workingDirs[state.currentBranch] = working;

        // Remove from staging if it was staged
        state.stagingFiles = state.stagingFiles.filter(f => f.name !== fileName);

        render();
    }

    function restoreFile(fileName) {
        // Restore a deleted file back to clean status
        const tracked = state.trackedFiles[state.currentBranch] || [];
        const target = tracked.find(f => f.name === fileName);

        if (!target || target.status !== 'deleted') return;

        target.status = 'clean';

        // Update working directory
        const working = state.workingDirs[state.currentBranch] || [];
        const workingFile = working.find(f => f.name === fileName);
        if (workingFile) {
            workingFile.status = 'clean';
        }

        // Remove from staging if it was staged for deletion
        state.stagingFiles = state.stagingFiles.filter(f => f.name !== fileName);

        render();
    }

    function renameFile(oldName) {
        const newName = prompt('Enter new file name', oldName);
        if (!newName || newName.trim() === '' || newName === oldName) return;
        const trimmed = newName.trim();
        const conflict = (state.trackedFiles[state.currentBranch] || []).some(f => f.name.toLowerCase() === trimmed.toLowerCase());
        if (conflict) {
            alert('A file with that name already exists on this branch');
            return;
        }

        const trackedList = state.trackedFiles[state.currentBranch] || [];
        const target = trackedList.find(f => f.name === oldName);
        if (!target) return;
        target.name = trimmed;
        target.status = 'modified';
        ensureTrackedSet(state.currentBranch);
        state.trackedDirs[state.currentBranch].delete(oldName);
        state.trackedDirs[state.currentBranch].add(trimmed);

        // Update working entries
        (state.workingDirs[state.currentBranch] || []).forEach(f => {
            if (f.name === oldName) {
                f.name = trimmed;
                f.status = 'modified';
            }
        });

        // Remove any staged entries for old name
        state.stagingFiles = state.stagingFiles.filter(f => f.name !== oldName);

        render();
    }

    function commitStagedFiles() {
        if (state.stagingFiles.length === 0) {
            alert('No files staged for commit');
            animateArea('staging-files', 'shake-animation');
            return;
        }

        // Separate deleted files from added/modified files
        const deletedFiles = state.stagingFiles.filter(f => f.status === 'deleted');
        const addedModifiedFiles = state.stagingFiles.filter(f => f.status !== 'deleted');

        // Find parent commit (last commit on current branch, or last commit if branch is new)
        const branchCommits = state.commits.filter(c => c.branch === state.currentBranch);
        const parentCommit = branchCommits.length > 0
            ? branchCommits[branchCommits.length - 1]
            : state.commits[state.commits.length - 1];

        // Get custom commit message from input, or generate default
        const messageInput = document.getElementById('commit-message-input');
        let commitMessage = messageInput ? messageInput.value.trim() : '';

        // If no custom message, generate a default one
        if (!commitMessage) {
            if (addedModifiedFiles.length > 0 && deletedFiles.length > 0) {
                commitMessage = `Update ${addedModifiedFiles.length} file(s), delete ${deletedFiles.length} file(s)`;
            } else if (deletedFiles.length > 0) {
                commitMessage = `Delete ${deletedFiles.length} file(s)`;
            } else {
                commitMessage = `Add ${addedModifiedFiles.length} file(s)`;
            }
        }

        const commit = {
            id: state.nextCommitId++,
            hash: generateCommitHash(),
            message: commitMessage,
            files: addedModifiedFiles.map(f => f.name),
            deletedFiles: deletedFiles.map(f => f.name),
            date: new Date().toLocaleString(),
            timestamp: Date.now(),
            pushed: false,
            branch: state.currentBranch,
            parentId: parentCommit ? parentCommit.id : null
        };

        state.commits.push(commit);

        // Clear the commit message input
        if (messageInput) {
            messageInput.value = '';
        }

        // Actually remove deleted files from tracked files
        const deletedNames = new Set(deletedFiles.map(f => f.name));
        state.trackedFiles[state.currentBranch] = (state.trackedFiles[state.currentBranch] || [])
            .filter(f => !deletedNames.has(f.name));

        // Remove deleted files from tracked dirs set
        deletedNames.forEach(name => {
            if (state.trackedDirs[state.currentBranch]) {
                state.trackedDirs[state.currentBranch].delete(name);
            }
        });

        state.stagingFiles = [];

        ensureTrackedSet(state.currentBranch);
        commit.files.forEach(name => state.trackedDirs[state.currentBranch].add(name));
        // Mark staged files as clean in tracked list (only for non-deleted files)
        state.trackedFiles[state.currentBranch] = mergeTrackedFiles(state.trackedFiles[state.currentBranch] || [], commit.files.map(name => ({ name, type: inferType(name), status: 'clean' })), state);

        // Update working dir list (already emptied staged files)
        state.workingDirs[state.currentBranch] = state.workingDirs[state.currentBranch] || [];

        animateArea('commit-graph-container', 'pulse-animation');
        render();
    }

    function pushToRemote() {
        const unpushedCommits = state.commits.filter(c => !c.pushed);

        if (unpushedCommits.length === 0) {
            alert('No new commits to push');
            animateArea('commit-graph-container', 'shake-animation');
            return;
        }

        unpushedCommits.forEach(commit => {
            commit.pushed = true;
            const remoteCommit = {
                ...commit,
                pushedAt: new Date().toLocaleString()
            };
            state.remoteCommits.push(remoteCommit);
        });

        // Sync remote file listing with tracked files for this branch
        ensureTrackedSet(state.currentBranch);
        state.remoteDirs[state.currentBranch] = new Set(state.trackedDirs[state.currentBranch]);

        animateArea('remote-commits-container', 'pulse-animation');
        render();
    }

    // ============================================
    // BRANCH OPERATIONS
    // ============================================

    function createBranch() {
        const input = document.getElementById('new-branch-name');
        const branchName = input.value.trim();

        if (!branchName) {
            alert('Please enter a branch name');
            return;
        }

        if (!state.initCommitted) {
            alert('Complete Section 1 (Git initialization) first');
            return;
        }

        // Check if branch already exists
        if (state.branches.includes(branchName)) {
            alert('A branch with this name already exists');
            return;
        }

        state.branches.push(branchName);

        // Clone working and remote files from current branch
        const trackedNames = Array.from(state.trackedDirs[state.currentBranch] || []);
        state.workingDirs[branchName] = trackedNames.map(name => ({ id: state.nextFileId++, name, type: inferType(name), status: 'clean' }));
        state.remoteDirs[branchName] = new Set(state.remoteDirs[state.currentBranch] || []);
        state.trackedDirs[branchName] = new Set(state.trackedDirs[state.currentBranch] || []);
        state.trackedFiles[branchName] = (state.trackedFiles[state.currentBranch] || []).map(f => ({ ...f, id: state.nextFileId++ }));

        state.currentBranch = branchName;
        input.value = '';

        animateArea('branches-container', 'pulse-animation');
        render();
    }

    function switchBranch(branchName) {
        if (state.stagingFiles.length > 0) {
            alert('Please commit or discard staged changes before switching branches');
            return;
        }

        state.currentBranch = branchName;
        render();
    }

    function mergeBranch() {
        const source = document.getElementById('merge-source').value;
        const target = document.getElementById('merge-target').value;

        if (!source || !target || source === target) {
            alert('Select two different branches to merge');
            return;
        }

        // Find last commits on target and source
        const targetCommits = state.commits.filter(c => c.branch === target);
        const sourceCommits = state.commits.filter(c => c.branch === source);
        const targetParent = targetCommits[targetCommits.length - 1];
        const sourceParent = sourceCommits[sourceCommits.length - 1];

        const commit = {
            id: state.nextCommitId++,
            hash: generateCommitHash(),
            message: `Merge branch '${source}' into ${target}`,
            files: [],
            date: new Date().toLocaleString(),
            timestamp: Date.now(),
            pushed: false,
            isMerge: true,
            branch: target,
            parentId: targetParent ? targetParent.id : null,
            mergeParentId: sourceParent ? sourceParent.id : null,
            mergedBranch: source
        };

        state.commits.push(commit);

        // Merge working directories: union of files
        const targetFiles = new Set((state.workingDirs[target] || []).map(f => f.name));
        (state.workingDirs[source] || []).forEach(f => targetFiles.add(f.name));
        state.workingDirs[target] = Array.from(targetFiles).map(name => ({
            id: state.nextFileId++,
            name,
            type: inferType(name),
            status: 'merged'
        }));

        animateArea('commit-graph-container', 'pulse-animation');
        render();
    }

    function validateMergeSelection() {
        const source = document.getElementById('merge-source').value;
        const target = document.getElementById('merge-target').value;
        document.getElementById('merge-branch-btn').disabled = (!source || !target || source === target);
    }

    function resetDemo() {
        if (!confirm('Reset the entire demo? This will clear all changes.')) return;

        // Clear localStorage to remove stale state
        localStorage.removeItem('gitDemoState');

        state = {
            initFiles: [],
            initGitInitialized: false,
            initStaged: false,
            initCommitted: false,
            workingFiles: [],
            stagingFiles: [],
            commits: [],
            remoteCommits: [],
            branches: ['main'],
            currentBranch: 'main',
            workingDirs: { main: [] },
            remoteDirs: { main: new Set() },
            trackedDirs: { main: new Set() },
            trackedFiles: { main: [] },
            nextFileId: 1,
            nextCommitId: 1
        };

        render();
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    function generateCommitHash() {
        const chars = '0123456789abcdef';
        let hash = '';
        for (let i = 0; i < 7; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    function animateArea(elementId, animationClass) {
        const element = document.getElementById(elementId);
        if (!element) return;
        element.classList.add(animationClass);
        setTimeout(() => element.classList.remove(animationClass), 500);
    }

    function showCommitDetails(commit) {
        const modalBody = document.getElementById('commitDetailsBody');
        if (!modalBody) return;

        // Build the files list HTML
        let filesHtml = '';
        if (commit.files && commit.files.length > 0) {
            filesHtml = `
                <div class="commit-detail-section">
                    <h6>📁 Files Added/Modified</h6>
                    <ul class="commit-files-list">
                        ${commit.files.map(f => `<li><span class="file-icon">${fileIcons[inferType(f)] || '📄'}</span> ${f}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Build the deleted files list HTML
        let deletedFilesHtml = '';
        if (commit.deletedFiles && commit.deletedFiles.length > 0) {
            deletedFilesHtml = `
                <div class="commit-detail-section">
                    <h6>🗑️ Files Deleted</h6>
                    <ul class="commit-files-list deleted-files">
                        ${commit.deletedFiles.map(f => `<li><span class="file-icon">🗑️</span> <span class="deleted-file-name">${f}</span></li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Build status badges
        const statusBadges = [];
        if (commit.pushed) {
            statusBadges.push('<span class="badge bg-purple">✓ Pushed to Remote</span>');
        } else {
            statusBadges.push('<span class="badge bg-secondary">Local Only</span>');
        }
        if (commit.isMerge) {
            statusBadges.push(`<span class="badge bg-info">🔀 Merge from ${commit.mergedBranch}</span>`);
        }
        if (commit.isInitialCommit) {
            statusBadges.push('<span class="badge bg-success">🌱 Initial Commit</span>');
        }

        modalBody.innerHTML = `
            <div class="commit-detail-header">
                <div class="commit-hash-large">
                    <code>${commit.hash}</code>
                </div>
                <div class="commit-status-badges">
                    ${statusBadges.join(' ')}
                </div>
            </div>
            
            <div class="commit-detail-section">
                <h6>💬 Commit Message</h6>
                <div class="commit-message-box">
                    ${commit.message}
                </div>
            </div>
            
            <div class="commit-detail-row">
                <div class="commit-detail-item">
                    <span class="detail-label">🌿 Branch:</span>
                    <span class="detail-value branch-name-tag">${commit.branch || 'main'}</span>
                </div>
                <div class="commit-detail-item">
                    <span class="detail-label">📅 Date:</span>
                    <span class="detail-value">${commit.date}</span>
                </div>
            </div>
            
            ${filesHtml}
            ${deletedFilesHtml}
            
            ${commit.parentId ? `
                <div class="commit-detail-section">
                    <h6>⬆️ Parent Commit</h6>
                    <code class="parent-hash">${getCommitHashById(commit.parentId)}</code>
                </div>
            ` : ''}
        `;

        // Show the modal using Bootstrap
        const modalEl = document.getElementById('commitDetailsModal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }

    function getCommitHashById(commitId) {
        const commit = state.commits.find(c => c.id === commitId);
        return commit ? commit.hash : 'unknown';
    }

    function stretchBannersToSections() {
        const banner1 = document.getElementById('banner-init');
        const banner2 = document.getElementById('banner-workflow');
        const section1 = document.getElementById('section1-block');
        const section2 = document.getElementById('section2-block');

        if (!banner1 || !banner2 || !section1 || !section2) return;

        // Reset so measurement isn't affected by prior explicit heights.
        banner1.style.height = '';
        banner2.style.height = '';

        const h1 = Math.max(banner1.offsetHeight, section1.offsetHeight);
        const h2 = Math.max(banner2.offsetHeight, section2.offsetHeight);

        banner1.style.height = `${h1}px`;
        banner2.style.height = `${h2}px`;

        banner1.classList.add('banner-stretched');
        banner2.classList.add('banner-stretched');
    }

    function alignSectionBanners() {
        const bannersCol = document.querySelector('.banners-column');
        const bannerInit = document.getElementById('banner-init');
        const spacer = document.getElementById('banner-spacer');
        const regularAnchor = document.getElementById('regular-workflow-anchor');

        if (!bannersCol || !bannerInit || !spacer || !regularAnchor) return;

        // We align Banner 2 to the start of the regular workflow.
        const bannersTop = bannersCol.getBoundingClientRect().top;
        const regularTop = regularAnchor.getBoundingClientRect().top;
        const targetOffset = Math.max(0, regularTop - bannersTop);

        const banner1Total = bannerInit.offsetHeight + parseFloat(getComputedStyle(bannerInit).marginBottom || '0');
        const desiredSpacer = Math.max(0, Math.round(targetOffset - banner1Total));

        spacer.style.height = `${desiredSpacer}px`;
    }

    function layoutBanners() {
        // Order matters: stretch first, then compute spacer based on final banner1 height.
        stretchBannersToSections();
        alignSectionBanners();
    }

    // Keep banner alignment correct on resize
    window.addEventListener('resize', () => {
        requestAnimationFrame(layoutBanners);
    });

    // ============================================
    // RENDER FUNCTIONS
    // ============================================

    function render() {
        // Update counts
        document.getElementById('untracked-count').textContent = state.initFiles.length;
        const currentDir = state.workingDirs[state.currentBranch] || [];
        document.getElementById('working-count').textContent = currentDir.length;
        document.getElementById('staging-count').textContent = state.stagingFiles.length;
        document.getElementById('committed-count').textContent = state.commits.length;
        const pushed = state.commits.filter(c => c.pushed);
        document.getElementById('remote-count').textContent = pushed.length;
        document.getElementById('branch-count').textContent = state.branches.length;

        // Buttons enable/disable
        document.getElementById('git-init-btn').disabled = state.initGitInitialized;
        document.getElementById('git-add-init-btn').disabled = !state.initGitInitialized || state.initStaged;
        document.getElementById('first-commit-btn').disabled = !state.initStaged || state.initCommitted;
        document.getElementById('commit-btn').disabled = state.stagingFiles.length === 0;
        document.getElementById('push-btn').disabled = state.commits.filter(c => !c.pushed).length === 0;

        // Lock Section 1 controls after first commit
        const initLocked = state.initCommitted;
        const initInput = document.getElementById('init-file-name');
        const addInitBtn = document.getElementById('add-init-file-btn');
        const gitInitBtn = document.getElementById('git-init-btn');
        const gitAddBtn = document.getElementById('git-add-init-btn');
        const firstCommitBtn = document.getElementById('first-commit-btn');

        if (initInput) initInput.disabled = initLocked;
        if (addInitBtn) addInitBtn.disabled = initLocked; // allow adding until committed
        if (gitInitBtn) gitInitBtn.disabled = initLocked || state.initGitInitialized;
        if (gitAddBtn) gitAddBtn.disabled = initLocked || !state.initGitInitialized || state.initStaged;
        if (firstCommitBtn) firstCommitBtn.disabled = initLocked || !state.initStaged || state.initCommitted;

        // Branch selects for merge
        const srcSelect = document.getElementById('merge-source');
        const tgtSelect = document.getElementById('merge-target');
        srcSelect.innerHTML = '';
        tgtSelect.innerHTML = '';
        state.branches.forEach(b => {
            const opt1 = document.createElement('option');
            opt1.value = b; opt1.textContent = b;
            srcSelect.appendChild(opt1);
            const opt2 = document.createElement('option');
            opt2.value = b; opt2.textContent = b;
            tgtSelect.appendChild(opt2);
        });
        srcSelect.value = state.currentBranch;
        tgtSelect.value = state.branches.includes('main') ? 'main' : state.branches[0];
        validateMergeSelection();

        // Section 1
        renderInitWorkflow();

        // Section 2 lists use branch-specific workingDir
        renderWorkingArea();
        renderStagingArea();

        // Local commits
        renderCommits();

        // Remote commits
        renderRemoteCommits();

        // Branch list
        renderBranches();

        // Stretch banners
        stretchBannersToSections();

        // Render file lists under track
        renderWorkingFilesListBox();
        renderRemoteFilesListBox();
    }

    // Render init workflow (alias for backward compatibility)
    function renderInitWorkflow() {
        renderInitSection();
    }

    function renderInitSection() {
        // Step 1: Untracked files in empty directory
        const untrackedContainer = document.getElementById('init-untracked-files');
        untrackedContainer.innerHTML = '';
        if (state.initFiles.length === 0) {
            untrackedContainer.innerHTML = '<div class="empty-state">Add files to get started</div>';
        } else {
            state.initFiles.forEach(file => {
                const card = createSimpleFileCard(file);
                untrackedContainer.appendChild(card);
            });
        }

        // Step 2: After git init
        const workingContainer = document.getElementById('init-working-files');
        workingContainer.innerHTML = '';
        if (!state.initGitInitialized) {
            workingContainer.innerHTML = '<div class="empty-state">Run git init first</div>';
        } else {
            workingContainer.innerHTML = '<div class="file-list-simple">' +
                state.initFiles.map(f => `<div class="file-item-simple">${fileIcons[f.type] || fileIcons.default} ${f.name}</div>`).join('') +
                '</div>';
        }

        // Step 3: Staging
        const stagingContainer = document.getElementById('init-staging-files');
        stagingContainer.innerHTML = '';
        if (!state.initStaged) {
            stagingContainer.innerHTML = '<div class="empty-state">Run git add . first</div>';
        } else {
            stagingContainer.innerHTML = '<div class="file-list-simple">' +
                state.initFiles.map(f => `<div class="file-item-simple">${fileIcons[f.type] || fileIcons.default} ${f.name}</div>`).join('') +
                '</div>';
        }

        // Step 4: First commit
        const commitsContainer = document.getElementById('init-commits-container');
        commitsContainer.innerHTML = '';
        if (!state.initCommitted) {
            commitsContainer.innerHTML = '<div class="empty-state">Make first commit</div>';
        } else {
            const firstCommit = state.commits.find(c => c.isInitialCommit);
            if (firstCommit) {
                const card = createCommitCard(firstCommit, 'local');
                commitsContainer.appendChild(card);
            }
        }
    }

    function renderWorkingArea() {
        const workingContainer = document.getElementById('working-files');
        const trackedList = state.trackedFiles[state.currentBranch] || [];
        let workingList = state.workingDirs[state.currentBranch] || [];

        // Identify files currently in working directory (by ID or Name)
        const workingMap = new Map();
        workingList.forEach(f => workingMap.set(f.name, f));

        // Sync with tracked files:
        // 1. If a tracked file is modified/new, it MUST be in working directory.
        // 2. If a tracked file is clean, it serves as the base for working directory if not present (to show available files).
        // However, we want to avoid duplicates.

        const finalWorkingList = [];
        const processedNames = new Set();

        // First, preserve existing working objects (which might have transient state if we had any, though currently not much)
        // But checking against tracked list is safer.

        trackedList.forEach(tf => {
            let workingFile = workingMap.get(tf.name);

            if (workingFile) {
                // If it exists in working list, update its status/type from tracked source of truth
                // UNLESS the working file is locally modified before tracking updates?
                // In this simplified model, trackedFiles holds the 'status' (modified/new/clean).
                workingFile.status = tf.status;
                workingFile.type = tf.type;
                workingFile.id = tf.id; // Sync ID
            } else {
                // Not in working list (e.g. was staged then commited -> becomes clean).
                // Or simply missing. Re-create it.
                workingFile = { ...tf };
            }

            finalWorkingList.push(workingFile);
            processedNames.add(tf.name);
        });

        // Add any files in working list that are NOT in tracked list (e.g. newly added but somehow not yet tracked?
        // In current logic, addWorkingFile adds to tracked immediately. But safe capability).
        workingList.forEach(f => {
            if (!processedNames.has(f.name)) {
                finalWorkingList.push(f);
                processedNames.add(f.name);
            }
        });

        state.workingDirs[state.currentBranch] = finalWorkingList;

        workingContainer.innerHTML = '';

        if (finalWorkingList.length === 0) {
            workingContainer.innerHTML = '<div class="empty-state">No files yet</div>';
        } else {
            // Sort by status (New/Modified first) then name
            finalWorkingList.sort((a, b) => {
                const score = s => (s === 'modified' || s === 'new') ? 0 : 1;
                if (score(a.status) !== score(b.status)) return score(a.status) - score(b.status);
                return a.name.localeCompare(b.name);
            });

            finalWorkingList.forEach(file => {
                // Filter out staged files from showing up in working directory list
                // if we want them to disappear when staged.
                // Current logic: stageFile SPLICES from workingDirs.
                // But renderWorkingArea REBUILDs workingDirs from trackedFiles.
                // If a file is staged, its status in trackedFiles is 'modified' or 'new'.
                // But it sits in state.stagingFiles.

                // CRITICAL FIX: Do not show files that are currently STAGED.
                const isStaged = state.stagingFiles.some(sf => sf.name === file.name);
                if (!isStaged) {
                    const card = createFileCard(file, 'working');
                    workingContainer.appendChild(card);
                }
            });
        }
    }

    function renderStagingArea() {
        const stagingContainer = document.getElementById('staging-files');
        stagingContainer.innerHTML = '';
        if (state.stagingFiles.length === 0) {
            stagingContainer.innerHTML = '<div class="empty-state">No files staged</div>';
        } else {
            state.stagingFiles.forEach(file => {
                const card = createFileCard(file, 'staging');
                stagingContainer.appendChild(card);
            });
        }
    }

    function renderCommits() {
        const svg = d3.select('#commit-graph-svg');
        const emptyState = document.getElementById('empty-commits');

        if (state.commits.length === 0) {
            emptyState.style.display = 'block';
            svg.selectAll('*').remove();
            return;
        }

        emptyState.style.display = 'none';
        renderCommitGraph(svg);
    }

    function renderRemoteCommits() {
        const svg = d3.select('#remote-graph-svg');
        const emptyState = document.getElementById('empty-remote');
        const pushed = state.commits.filter(c => c.pushed);

        if (pushed.length === 0) {
            emptyState.style.display = 'block';
            svg.selectAll('*').remove();
            return;
        }

        emptyState.style.display = 'none';
        renderRemoteGraph(svg, pushed);
    }

    function getBranchSpacing() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--branch-spacing-x')) || 60;
    }

    function renderCommitGraph(svg) {
        svg.selectAll('*').remove();

        // Graph layout parameters
        const nodeRadius = 10;
        const nodeSpacingY = 50;
        const branchSpacingX = getBranchSpacing();
        const startX = 40;
        const startY = 35;
        const labelOffsetX = 20;

        // Assign x positions based on branches (main is always first/leftmost)
        const branchXPositions = { 'main': startX };
        let branchIndex = 1;
        state.branches.forEach(branch => {
            if (branch !== 'main') {
                branchXPositions[branch] = startX + branchIndex * branchSpacingX;
                branchIndex++;
            }
        });

        // Build a timeline: commits are ordered in their creation order
        // But we need to track where each branch "forks" from
        const branchStartY = {}; // Track where each branch starts vertically
        const commitPositions = {};
        let currentY = startY;

        // First pass: assign Y positions in order, tracking branch forks
        state.commits.forEach((commit, index) => {
            const branch = commit.branch || 'main';
            const x = branchXPositions[branch] || startX;

            // If this is the first commit on a non-main branch, note where it forks
            if (branch !== 'main' && !branchStartY[branch]) {
                branchStartY[branch] = currentY;
            }

            currentY = startY + index * nodeSpacingY;
            commitPositions[commit.id] = { x, y: currentY, commit };
        });

        // Calculate SVG dimensions
        const svgHeight = Math.max(250, state.commits.length * nodeSpacingY + 80);
        const svgWidth = Math.max(180, Object.keys(branchXPositions).length * branchSpacingX + 120);
        svg.attr('width', svgWidth).attr('height', svgHeight);

        // Draw branch labels at top
        const labelsGroup = svg.append('g').attr('class', 'branch-labels');
        Object.entries(branchXPositions).forEach(([branch, x]) => {
            const labelWidth = Math.max(branch.length * 6 + 8, 40);
            const labelHeight = 14;

            labelsGroup.append('rect')
                .attr('class', 'branch-label-bg')
                .attr('x', x - labelWidth / 2)
                .attr('y', 3)
                .attr('width', labelWidth)
                .attr('height', labelHeight)
                .attr('rx', 3)
                .attr('fill', branch === 'main' ? '#1E88E5' : '#4CAF50');

            labelsGroup.append('text')
                .attr('class', 'branch-label-graph')
                .attr('x', x)
                .attr('y', 13)
                .attr('text-anchor', 'middle')
                .attr('font-size', '9px')
                .text(branch);
        });

        // Draw edges (behind nodes)
        const edgesGroup = svg.append('g').attr('class', 'edges');

        state.commits.forEach(commit => {
            const pos = commitPositions[commit.id];
            if (!pos) return;

            // Draw edge to parent
            if (commit.parentId && commitPositions[commit.parentId]) {
                const parentPos = commitPositions[commit.parentId];
                drawEdge(edgesGroup, parentPos, pos, commit.branch || 'main', false);
            }

            // Draw merge edge
            if (commit.isMerge && commit.mergeParentId && commitPositions[commit.mergeParentId]) {
                const mergeParentPos = commitPositions[commit.mergeParentId];
                drawEdge(edgesGroup, mergeParentPos, pos, 'merge', true);
            }
        });

        // Draw nodes
        const nodesGroup = svg.append('g').attr('class', 'nodes');

        state.commits.forEach(commit => {
            const pos = commitPositions[commit.id];
            if (!pos) return;

            const nodeGroup = nodesGroup.append('g')
                .attr('class', 'commit-node')
                .attr('transform', `translate(${pos.x}, ${pos.y})`);

            // Determine node style
            let fillColor = '#1E88E5'; // main branch blue
            let strokeColor = '#1565C0';
            if (commit.isMerge) {
                fillColor = '#9C27B0'; // purple for merge
                strokeColor = '#6A1B9A';
            } else if (commit.branch && commit.branch !== 'main') {
                fillColor = '#4CAF50'; // green for feature branches
                strokeColor = '#2E7D32';
            }

            // Draw commit circle
            nodeGroup.append('circle')
                .attr('r', nodeRadius)
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('fill', fillColor)
                .attr('stroke', strokeColor)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', commit.pushed ? 'none' : '3,2');

            // Draw hash label
            nodeGroup.append('text')
                .attr('class', 'commit-label')
                .attr('x', labelOffsetX)
                .attr('y', -2)
                .attr('font-size', '9px')
                .text(commit.hash);

            // Draw message label (truncated)
            const shortMessage = commit.message.length > 18
                ? commit.message.substring(0, 16) + '...'
                : commit.message;
            nodeGroup.append('text')
                .attr('class', 'commit-message-label')
                .attr('x', labelOffsetX)
                .attr('y', 10)
                .attr('font-size', '8px')
                .text(shortMessage);

            // Add pushed indicator
            if (commit.pushed) {
                nodeGroup.append('circle')
                    .attr('r', 3)
                    .attr('cx', nodeRadius - 2)
                    .attr('cy', -nodeRadius + 2)
                    .attr('fill', '#9C27B0');
            }

            // Tooltip on hover
            nodeGroup.append('title')
                .text(`${commit.hash}\n${commit.message}\nBranch: ${commit.branch || 'main'}\n${commit.date}${commit.pushed ? '\n✓ Pushed' : ''}`);

            // Click handler to show commit details modal
            nodeGroup.style('cursor', 'pointer')
                .on('click', function(event) {
                    event.stopPropagation();
                    showCommitDetails(commit);
                });
        });
    }

    function drawEdge(group, from, to, branchType, isMerge) {
        let strokeColor = '#1E88E5'; // main blue
        if (isMerge) {
            strokeColor = '#9C27B0'; // purple
        } else if (branchType !== 'main') {
            strokeColor = '#4CAF50'; // green
        }

        const strokeDasharray = isMerge ? '4,2' : 'none';

        // If same X, draw straight line; otherwise draw curved path
        if (from.x === to.x) {
            group.append('line')
                .attr('x1', from.x)
                .attr('y1', from.y)
                .attr('x2', to.x)
                .attr('y2', to.y)
                .attr('stroke', strokeColor)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', strokeDasharray);
        } else {
            // Curved path for branch connections
            const midY = (from.y + to.y) / 2;
            const path = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
            group.append('path')
                .attr('d', path)
                .attr('fill', 'none')
                .attr('stroke', strokeColor)
                .attr('stroke-width', 2)
                .attr('stroke-linecap', 'round')
                .attr('stroke-dasharray', strokeDasharray);
        }
    }

    function renderRemoteGraph(svg, pushedCommits) {
        svg.selectAll('*').remove();

        const nodeRadius = 10;
        const nodeSpacingY = 50;
        const branchSpacingX = getBranchSpacing();
        const startX = 40;
        const startY = 35;
        const labelOffsetX = 20;

        const pushedBranches = [...new Set(pushedCommits.map(c => c.branch || 'main'))];

        const branchXPositions = { main: startX };
        let branchIndex = 1;
        pushedBranches.forEach(branch => {
            if (branch !== 'main') {
                branchXPositions[branch] = startX + branchIndex * branchSpacingX;
                branchIndex++;
            }
        });

        const commitPositions = {};
        let currentY = startY;
        pushedCommits.forEach((commit, index) => {
            const branch = commit.branch || 'main';
            const x = branchXPositions[branch] || startX;
            currentY = startY + index * nodeSpacingY;
            commitPositions[commit.id] = { x, y: currentY, commit };
        });

        const svgHeight = Math.max(250, pushedCommits.length * nodeSpacingY + 80);
        const svgWidth = Math.max(180, Object.keys(branchXPositions).length * branchSpacingX + 120);
        svg.attr('width', svgWidth).attr('height', svgHeight);

        const labelsGroup = svg.append('g').attr('class', 'branch-labels');
        Object.entries(branchXPositions).forEach(([branch, x]) => {
            const labelWidth = Math.max(branch.length * 6 + 8, 40);
            const labelHeight = 14;

            labelsGroup.append('rect')
                .attr('class', 'branch-label-bg')
                .attr('x', x - labelWidth / 2)
                .attr('y', 3)
                .attr('width', labelWidth)
                .attr('height', labelHeight)
                .attr('rx', 3)
                .attr('fill', '#9C27B0');

            labelsGroup.append('text')
                .attr('class', 'branch-label-graph')
                .attr('x', x)
                .attr('y', 13)
                .attr('text-anchor', 'middle')
                .attr('font-size', '9px')
                .text(branch);
        });

        const edgesGroup = svg.append('g').attr('class', 'edges');

        pushedCommits.forEach(commit => {
            const pos = commitPositions[commit.id];
            if (!pos) return;

            if (commit.parentId && commitPositions[commit.parentId]) {
                const parentPos = commitPositions[commit.parentId];
                drawRemoteEdge(edgesGroup, parentPos, pos, commit.branch || 'main', false);
            }

            if (commit.isMerge && commit.mergeParentId && commitPositions[commit.mergeParentId]) {
                const mergeParentPos = commitPositions[commit.mergeParentId];
                drawRemoteEdge(edgesGroup, mergeParentPos, pos, 'merge', true);
            }
        });

        const nodesGroup = svg.append('g').attr('class', 'nodes');

        pushedCommits.forEach(commit => {
            const pos = commitPositions[commit.id];
            if (!pos) return;

            const nodeGroup = nodesGroup.append('g')
                .attr('class', 'commit-node')
                .attr('transform', `translate(${pos.x}, ${pos.y})`);

            let fillColor = '#9C27B0';
            let strokeColor = '#6A1B9A';
            if (commit.isMerge) {
                fillColor = '#7B1FA2';
                strokeColor = '#4A148C';
            } else if (commit.branch && commit.branch !== 'main') {
                fillColor = '#AB47BC';
                strokeColor = '#7B1FA2';
            }

            nodeGroup.append('circle')
                .attr('r', nodeRadius)
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('fill', fillColor)
                .attr('stroke', strokeColor)
                .attr('stroke-width', 2);

            nodeGroup.append('text')
                .attr('class', 'commit-label')
                .attr('x', labelOffsetX)
                .attr('y', -2)
                .attr('font-size', '9px')
                .text(commit.hash);

            const shortMessage = commit.message.length > 18
                ? commit.message.substring(0, 16) + '...'
                : commit.message;
            nodeGroup.append('text')
                .attr('class', 'commit-message-label')
                .attr('x', labelOffsetX)
                .attr('y', 10)
                .attr('font-size', '8px')
                .text(shortMessage);

            nodeGroup.append('title')
                .text(`${commit.hash}\n${commit.message}\nBranch: ${commit.branch || 'main'}\n${commit.date}\n✓ Pushed to remote`);

            // Click handler to show commit details modal
            nodeGroup.style('cursor', 'pointer')
                .on('click', function(event) {
                    event.stopPropagation();
                    showCommitDetails(commit);
                });
        });
    }

    function drawRemoteEdge(group, from, to, branchType, isMerge) {
        // All purple tones for remote
        let strokeColor = '#9C27B0';
        if (isMerge) {
            strokeColor = '#7B1FA2';
        } else if (branchType !== 'main') {
            strokeColor = '#AB47BC';
        }

        const strokeDasharray = isMerge ? '4,2' : 'none';

        if (from.x === to.x) {
            group.append('line')
                .attr('x1', from.x)
                .attr('y1', from.y)
                .attr('x2', to.x)
                .attr('y2', to.y)
                .attr('stroke', strokeColor)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', strokeDasharray);
        } else {
            const midY = (from.y + to.y) / 2;
            const path = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
            group.append('path')
                .attr('d', path)
                .attr('fill', 'none')
                .attr('stroke', strokeColor)
                .attr('stroke-width', 2)
                .attr('stroke-linecap', 'round')
                .attr('stroke-dasharray', strokeDasharray);
        }
    }

    function renderBranches() {
        const container = document.getElementById('branches-container');
        const currentDisplay = document.getElementById('current-branch-display');

        // Update current branch display
        if (currentDisplay) {
            currentDisplay.textContent = state.currentBranch;
        }

        // Render branch list
        if (container) {
            container.innerHTML = '';
            state.branches.forEach(branch => {
                const item = document.createElement('div');
                item.className = 'branch-item' + (branch === state.currentBranch ? ' branch-current' : '');
                item.innerHTML = `
                    <span class="branch-icon">${branch === state.currentBranch ? '●' : '○'}</span>
                    <span class="branch-name">${branch}</span>
                    ${branch === state.currentBranch ? '<span class="branch-badge">current</span>' : ''}
                `;
                item.addEventListener('click', () => switchBranch(branch));
                container.appendChild(item);
            });
        }

        // Update merge button
        const mergeBtn = document.getElementById('merge-branch-btn');
        if (mergeBtn) {
            mergeBtn.disabled = false;
            mergeBtn.textContent = '🔀 Merge branches';
        }
    }

    // ============================================
    // FILE LIST BOXES (Track Column)
    // ============================================

    function renderWorkingFilesListBox() {
        const container = document.getElementById('working-files-list-body');
        if (!container) return;

        const trackedList = state.trackedFiles[state.currentBranch] || [];

        container.innerHTML = '';

        if (trackedList.length === 0) {
            container.innerHTML = '<div class="empty-state">No files yet</div>';
        } else {
            trackedList.forEach(file => {
                const icon = fileIcons[file.type] || fileIcons.default;
                const div = document.createElement('div');
                div.className = 'file-item-simple';
                div.innerHTML = `${icon} ${file.name}`;
                container.appendChild(div);
            });
        }
    }

    function renderRemoteFilesListBox() {
        const container = document.getElementById('remote-files-list-body');
        if (!container) return;

        const remoteDirSet = state.remoteDirs[state.currentBranch];
        const remoteFiles = remoteDirSet ? Array.from(remoteDirSet) : [];

        container.innerHTML = '';

        if (remoteFiles.length === 0) {
            container.innerHTML = '<div class="empty-state">No remote files</div>';
        } else {
            remoteFiles.forEach(fileName => {
                const ext = fileName.split('.').pop().toLowerCase();
                const type = ['html', 'css', 'js', 'json', 'md', 'txt'].includes(ext) ? ext : 'default';
                const icon = fileIcons[type] || fileIcons.default;
                const div = document.createElement('div');
                div.className = 'file-item-simple';
                div.innerHTML = `${icon} ${fileName}`;
                container.appendChild(div);
            });
        }
    }

    function updateStats() {
        document.getElementById('untracked-count').textContent = state.initGitInitialized ? 0 : state.initFiles.length;
        document.getElementById('working-count').textContent = state.workingFiles.length;
        document.getElementById('staging-count').textContent = state.stagingFiles.length;
        document.getElementById('committed-count').textContent = state.commits.length;
        document.getElementById('remote-count').textContent = state.remoteCommits.length;
        document.getElementById('branch-count').textContent = state.branches.length;
    }

    function updateButtons() {
        // Section 1 buttons
        document.getElementById('git-init-btn').disabled = state.initFiles.length === 0 || state.initGitInitialized;
        document.getElementById('git-add-init-btn').disabled = !state.initGitInitialized || state.initStaged;
        document.getElementById('first-commit-btn').disabled = !state.initStaged || state.initCommitted;

        // Section 2 buttons
        document.getElementById('commit-btn').disabled = state.stagingFiles.length === 0;

        const pushBtn = document.getElementById('push-btn');
        const unpushedCount = state.commits.filter(c => !c.pushed).length;
        pushBtn.disabled = unpushedCount === 0;
        pushBtn.textContent = unpushedCount > 0 ?
            `☁️ Push ${unpushedCount} Commit${unpushedCount > 1 ? 's' : ''}` :
            '☁️ Push to Remote';
    }

    // ============================================
    // CARD CREATION
    // ============================================

    function createSimpleFileCard(file) {
        const card = document.createElement('div');
        card.className = 'file-item-simple';
        card.innerHTML = `${fileIcons[file.type] || fileIcons.default} ${file.name}`;
        return card;
    }

    function createFileCard(file, area) {
        const card = document.createElement('div');
        card.className = 'file-card' + (file.status === 'deleted' ? ' file-card-deleted' : '');

        const icon = fileIcons[file.type] || fileIcons.default;
        const statusText = file.status === 'new' ? 'New' :
                          (file.status === 'modified' ? 'Modified' :
                          (file.status === 'deleted' ? 'Deleted' : 'Clean'));

        let buttonHTML = '';
        if (area === 'working') {
            if (file.status === 'deleted') {
                // For deleted files: show Stage and Restore buttons
                buttonHTML = `
                    <button class="file-btn file-btn-stage">➕ Stage Deletion</button>
                    <button class="file-btn file-btn-restore" type="button">↩️ Restore</button>
                `;
            } else {
                // For normal files: show all buttons
                buttonHTML = `
                    <button class="file-btn file-btn-stage" ${file.status === 'clean' ? 'disabled' : ''}>➕ Stage</button>
                    <button class="file-btn file-btn-modify" type="button">✏️ Modify</button>
                    <button class="file-btn file-btn-rename" type="button">📝 Rename</button>
                    <button class="file-btn file-btn-delete" type="button">🗑️ Delete</button>
                `;
            }
        } else {
            // Staging area
            if (file.status === 'deleted') {
                buttonHTML = `<button class="file-btn file-btn-unstage">↩️ Unstage Deletion</button>`;
            } else {
                buttonHTML = `<button class="file-btn file-btn-unstage">➖ Unstage</button>`;
            }
        }

        card.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${file.status === 'deleted' ? '🗑️' : icon}</div>
                <div class="file-details">
                    <div class="file-name${file.status === 'deleted' ? ' file-name-deleted' : ''}">${file.name}</div>
                    <div class="file-status file-status-${file.status}">${statusText}</div>
                </div>
            </div>
            <div class="file-actions">${buttonHTML}</div>
        `;

        const buttons = card.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.classList.contains('file-btn-stage')) {
                btn.addEventListener('click', () => {
                    if (file.status === 'clean') {
                        alert('Modify the file before staging');
                        return;
                    }
                    stageFile(file.id || file.name);
                });
            } else if (btn.classList.contains('file-btn-unstage')) {
                btn.addEventListener('click', () => unstageFile(file.id));
            } else if (btn.classList.contains('file-btn-modify')) {
                btn.addEventListener('click', () => modifyFile(file.name));
            } else if (btn.classList.contains('file-btn-delete')) {
                btn.addEventListener('click', () => {
                    if (confirm(`Delete ${file.name}?`)) {
                        deleteFile(file.name);
                    }
                });
            } else if (btn.classList.contains('file-btn-rename')) {
                btn.addEventListener('click', () => renameFile(file.name));
            } else if (btn.classList.contains('file-btn-restore')) {
                btn.addEventListener('click', () => restoreFile(file.name));
            }
        });

        return card;
    }

    function createCommitCard(commit, type) {
        const card = document.createElement('div');
        card.className = `commit-card commit-card-${type}`;

        const filesList = commit.files.map(f => `<div class="file-item-simple">${fileIcons[inferType(f)]} ${f}</div>`).join('');

        card.innerHTML = `
            <div class="commit-header">
                <div class="commit-hash">${commit.hash}</div>
                <div class="commit-meta">
                    <div class="commit-date">${commit.date}</div>
                    <div class="commit-branch">Branch: ${commit.branch}</div>
                </div>
            </div>
            <div class="commit-message">${commit.message}</div>
            <div class="commit-files">
                <div class="file-list-simple">
                    ${filesList}
                </div>
            </div>
        `;

        return card;
    }

    // ============================================
    // TYPE INFERENCE
    // ============================================

    function inferType(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        return ['html', 'css', 'js', 'json', 'md', 'txt'].includes(ext) ? ext : 'default';
    }

    // ============================================
    // TRACKED SET MANAGEMENT
    // ============================================

    function ensureTrackedSet(branch) {
        if (!state.trackedDirs[branch]) return;

        // Ensure trackedDirs set matches trackedFiles
        const trackedSet = new Set(state.trackedFiles[branch].map(f => f.name));
        state.trackedDirs[branch] = trackedSet;

        // Also ensure workingDirs matches trackedFiles for initial load
        if (state.workingDirs[branch]) {
            state.workingDirs[branch] = state.workingDirs[branch].filter(f => trackedSet.has(f.name));
        }
    }

    function mergeTrackedFiles(existing, updates, stateRef) {
        // Use name-based deduplication to prevent duplicates
        const mergedMap = new Map();

        // First, add all existing files keyed by name
        existing.forEach(f => {
            mergedMap.set(f.name.toLowerCase(), { ...f });
        });

        // Then, merge updates by name (update existing or add new)
        updates.forEach(update => {
            const key = update.name.toLowerCase();
            if (mergedMap.has(key)) {
                // Update existing file, preserving ID if not provided
                const existing = mergedMap.get(key);
                mergedMap.set(key, {
                    ...existing,
                    ...update,
                    id: existing.id || update.id || stateRef.nextFileId++
                });
            } else {
                // Add new file with ID
                mergedMap.set(key, {
                    ...update,
                    id: update.id || stateRef.nextFileId++
                });
            }
        });

        return Array.from(mergedMap.values());
    }

    // ============================================
    // LOCAL STORAGE (FOR DEMO STATE)
    // ============================================

    function saveStateToLocal() {
        const serializableState = JSON.parse(JSON.stringify(state));
        localStorage.setItem('gitDemoState', JSON.stringify(serializableState));
    }

    function loadStateFromLocal() {
        const savedState = localStorage.getItem('gitDemoState');
        if (savedState) {
            state = JSON.parse(savedState);
            // Re-establish references for sets/maps
            state.remoteDirs = Object.fromEntries(Object.entries(state.remoteDirs).map(([k, v]) => [k, new Set(v)]));
            state.trackedDirs = Object.fromEntries(Object.entries(state.trackedDirs).map(([k, v]) => [k, new Set(v)]));
        }
    }

    // Load state from local storage on startup
    loadStateFromLocal();

    // Save state to local storage on unload
    window.addEventListener('beforeunload', saveStateToLocal);

    // Initial render
    render();
})();
