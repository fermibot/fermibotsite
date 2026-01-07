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
        workingFiles: [],
        stagingFiles: [],
        commits: [],
        remoteCommits: [],

        // Branches
        branches: ['main'],
        currentBranch: 'main',

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

        // Reset
        document.getElementById('reset-btn').addEventListener('click', resetDemo);
    }

    // ============================================
    // SECTION 1: INIT WORKFLOW
    // ============================================

    function addInitFile() {
        const input = document.getElementById('init-file-name');
        const filename = input.value.trim();

        if (!filename) {
            alert('Please enter a filename');
            return;
        }

        if (state.initGitInitialized) {
            alert('Git is already initialized. Use Section 2 to add more files.');
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

        input.value = '';
        render();
    }

    function runGitInit() {
        if (state.initFiles.length === 0) {
            alert('Add at least one file before running git init');
            return;
        }

        state.initGitInitialized = true;
        animateArea('init-working-files', 'pulse-animation');
        render();
    }

    function gitAddInit() {
        if (!state.initGitInitialized) {
            alert('Run git init first');
            return;
        }

        state.initStaged = true;
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

        // Check if file already exists
        const allFiles = [...state.initFiles, ...state.workingFiles, ...state.stagingFiles];
        if (allFiles.some(f => f.name.toLowerCase() === filename.toLowerCase())) {
            alert('A file with this name already exists');
            return;
        }

        const ext = filename.split('.').pop().toLowerCase();
        const type = ['html', 'css', 'js', 'json', 'md', 'txt'].includes(ext) ? ext : 'default';

        state.workingFiles.push({
            id: state.nextFileId++,
            name: filename,
            type: type,
            status: 'new'
        });

        input.value = '';
        render();
    }

    function stageFile(fileId) {
        const fileIndex = state.workingFiles.findIndex(f => f.id === fileId);
        if (fileIndex === -1) return;

        const file = state.workingFiles.splice(fileIndex, 1)[0];
        state.stagingFiles.push(file);

        animateArea('staging-files', 'pulse-animation');
        render();
    }

    function unstageFile(fileId) {
        const fileIndex = state.stagingFiles.findIndex(f => f.id === fileId);
        if (fileIndex === -1) return;

        const file = state.stagingFiles.splice(fileIndex, 1)[0];
        state.workingFiles.push(file);

        animateArea('working-files', 'pulse-animation');
        render();
    }

    function commitStagedFiles() {
        if (state.stagingFiles.length === 0) {
            alert('No files staged for commit');
            animateArea('staging-files', 'shake-animation');
            return;
        }

        // Find parent commit (last commit on current branch, or last commit if branch is new)
        const branchCommits = state.commits.filter(c => c.branch === state.currentBranch);
        const parentCommit = branchCommits.length > 0
            ? branchCommits[branchCommits.length - 1]
            : state.commits[state.commits.length - 1];

        const commit = {
            id: state.nextCommitId++,
            hash: generateCommitHash(),
            message: `Add ${state.stagingFiles.length} file(s)`,
            files: state.stagingFiles.map(f => f.name),
            date: new Date().toLocaleString(),
            timestamp: Date.now(),
            pushed: false,
            branch: state.currentBranch,
            parentId: parentCommit ? parentCommit.id : null
        };

        state.commits.push(commit);
        state.stagingFiles = [];

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
        if (state.currentBranch === 'main') {
            alert('Already on main branch');
            return;
        }

        const mergingBranch = state.currentBranch;

        // Find the last commit on main and the last commit on the merging branch
        const mainCommits = state.commits.filter(c => c.branch === 'main');
        const branchCommits = state.commits.filter(c => c.branch === mergingBranch);
        const mainParent = mainCommits[mainCommits.length - 1];
        const branchParent = branchCommits[branchCommits.length - 1];

        // Create a merge commit
        const commit = {
            id: state.nextCommitId++,
            hash: generateCommitHash(),
            message: `Merge branch '${mergingBranch}' into main`,
            files: [],
            date: new Date().toLocaleString(),
            timestamp: Date.now(),
            pushed: false,
            isMerge: true,
            branch: 'main',
            parentId: mainParent ? mainParent.id : null,
            mergeParentId: branchParent ? branchParent.id : null,
            mergedBranch: mergingBranch
        };

        state.commits.push(commit);
        state.currentBranch = 'main';

        animateArea('commit-graph-container', 'pulse-animation');
        render();
    }

    function resetDemo() {
        if (!confirm('Reset the entire demo? This will clear all changes.')) return;

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
        renderInitSection();
        renderRegularSection();
        renderBranches();
        updateStats();
        updateButtons();
        // Align/stretch banners after DOM mutations above
        requestAnimationFrame(layoutBanners);
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

    function renderRegularSection() {
        // Working directory
        const workingContainer = document.getElementById('working-files');
        workingContainer.innerHTML = '';
        if (state.workingFiles.length === 0) {
            workingContainer.innerHTML = '<div class="empty-state">No modified files</div>';
        } else {
            state.workingFiles.forEach(file => {
                const card = createFileCard(file, 'working');
                workingContainer.appendChild(card);
            });
        }

        // Staging area
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

        // Local commits
        renderCommits();

        // Remote commits
        renderRemoteCommits();
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

    function renderCommitGraph(svg) {
        svg.selectAll('*').remove();

        // Graph layout parameters
        const nodeRadius = 10;
        const nodeSpacingY = 50;
        const branchSpacingX = 60;
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

        // Build a timeline: commits are ordered by their creation order
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

    function renderRemoteCommits() {
        const svg = d3.select('#remote-graph-svg');
        const emptyState = document.getElementById('empty-remote');

        // Get only pushed commits
        const pushedCommits = state.commits.filter(c => c.pushed);

        if (pushedCommits.length === 0) {
            emptyState.style.display = 'block';
            svg.selectAll('*').remove();
            return;
        }

        emptyState.style.display = 'none';
        renderRemoteGraph(svg, pushedCommits);
    }

    function renderRemoteGraph(svg, pushedCommits) {
        svg.selectAll('*').remove();

        // Graph layout parameters (same as local but slightly smaller)
        const nodeRadius = 10;
        const nodeSpacingY = 50;
        const branchSpacingX = 60;
        const startX = 40;
        const startY = 35;
        const labelOffsetX = 20;

        // Get branches that have pushed commits
        const pushedBranches = [...new Set(pushedCommits.map(c => c.branch || 'main'))];

        // Assign x positions based on branches (main is always first/leftmost)
        const branchXPositions = { 'main': startX };
        let branchIndex = 1;
        pushedBranches.forEach(branch => {
            if (branch !== 'main' && !branchXPositions[branch]) {
                branchXPositions[branch] = startX + branchIndex * branchSpacingX;
                branchIndex++;
            }
        });

        // Calculate positions for each commit
        const commitPositions = {};
        let currentY = startY;

        pushedCommits.forEach((commit, index) => {
            const branch = commit.branch || 'main';
            const x = branchXPositions[branch] || startX;
            currentY = startY + index * nodeSpacingY;
            commitPositions[commit.id] = { x, y: currentY, commit };
        });

        // Calculate SVG dimensions
        const svgHeight = Math.max(250, pushedCommits.length * nodeSpacingY + 80);
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
                .attr('fill', branch === 'main' ? '#9C27B0' : '#7B1FA2'); // Purple for remote

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

        pushedCommits.forEach(commit => {
            const pos = commitPositions[commit.id];
            if (!pos) return;

            // Draw edge to parent (if parent is also pushed)
            if (commit.parentId && commitPositions[commit.parentId]) {
                const parentPos = commitPositions[commit.parentId];
                drawRemoteEdge(edgesGroup, parentPos, pos, commit.branch || 'main', false);
            }

            // Draw merge edge (if merge parent is also pushed)
            if (commit.isMerge && commit.mergeParentId && commitPositions[commit.mergeParentId]) {
                const mergeParentPos = commitPositions[commit.mergeParentId];
                drawRemoteEdge(edgesGroup, mergeParentPos, pos, 'merge', true);
            }
        });

        // Draw nodes
        const nodesGroup = svg.append('g').attr('class', 'nodes');

        pushedCommits.forEach(commit => {
            const pos = commitPositions[commit.id];
            if (!pos) return;

            const nodeGroup = nodesGroup.append('g')
                .attr('class', 'commit-node')
                .attr('transform', `translate(${pos.x}, ${pos.y})`);

            // Determine node style - all purple tones for remote
            let fillColor = '#9C27B0'; // main remote purple
            let strokeColor = '#6A1B9A';
            if (commit.isMerge) {
                fillColor = '#7B1FA2';
                strokeColor = '#4A148C';
            } else if (commit.branch && commit.branch !== 'main') {
                fillColor = '#AB47BC';
                strokeColor = '#7B1FA2';
            }

            // Draw commit circle
            nodeGroup.append('circle')
                .attr('r', nodeRadius)
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('fill', fillColor)
                .attr('stroke', strokeColor)
                .attr('stroke-width', 2);

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

            // Tooltip on hover
            nodeGroup.append('title')
                .text(`${commit.hash}\n${commit.message}\nBranch: ${commit.branch || 'main'}\n${commit.date}\n✓ Pushed to remote`);
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
            mergeBtn.disabled = state.currentBranch === 'main';
            mergeBtn.textContent = state.currentBranch === 'main'
                ? '🔀 Merge into main'
                : `🔀 Merge ${state.currentBranch} → main`;
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
        card.className = 'file-card';

        const icon = fileIcons[file.type] || fileIcons.default;
        const statusText = file.status === 'new' ? 'New' : 'Modified';

        const buttonHTML = area === 'working' ?
            `<button class="file-btn file-btn-stage">➕ Stage</button>` :
            `<button class="file-btn file-btn-unstage">➖ Unstage</button>`;

        card.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${icon}</div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-status">${statusText}</div>
                </div>
            </div>
            <div class="file-actions">${buttonHTML}</div>
        `;

        const button = card.querySelector('button');
        button.addEventListener('click', () => {
            if (area === 'working') {
                stageFile(file.id);
            } else {
                unstageFile(file.id);
            }
        });

        return card;
    }

    function createCommitCard(commit, type = 'local') {
        const card = document.createElement('div');
        card.className = 'commit-card';

        const pushedBadge = type === 'local' && commit.pushed ?
            '<span style="background: #9C27B0; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">Pushed</span>' : '';

        card.innerHTML = `
            <div class="commit-header">
                <div class="commit-hash">${commit.hash}${pushedBadge}</div>
                <div class="commit-date">${commit.date}</div>
            </div>
            <div class="commit-message">${commit.message}</div>
            <div class="commit-files">
                <span class="commit-files-count">${commit.files.length} file(s):</span>
                ${commit.files.join(', ')}
            </div>
        `;

        return card;
    }

})();
