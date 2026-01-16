/* ============================================
   GIT BETA - SIMULATED GIT ENGINE
   Fully working in-browser Git simulation
   - No external CDN dependencies
   - Visual commit graphs
   - Push/Pull between users
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // SIMULATED GIT CORE
    // ============================================

    class SimulatedGit {
        constructor() {
            this.repos = {}; // { repoName: { commits: [], branches: {}, files: {}, head: 'main' } }
        }

        createRepo(name) {
            this.repos[name] = {
                commits: [],
                branches: { 'main': null },
                files: {},
                stagedFiles: {},
                head: 'main',
                remoteUrl: null
            };
            return this.repos[name];
        }

        getRepo(name) {
            return this.repos[name];
        }

        generateOid() {
            return Array.from({ length: 40 }, () =>
                Math.floor(Math.random() * 16).toString(16)
            ).join('');
        }

        addFile(repoName, filename, content) {
            const repo = this.repos[repoName];
            if (!repo) return false;
            repo.files[filename] = { content, status: 'untracked' };
            return true;
        }

        modifyFile(repoName, filename) {
            const repo = this.repos[repoName];
            if (!repo || !repo.files[filename]) return false;
            repo.files[filename].content += '\n// Modified at ' + new Date().toISOString();
            repo.files[filename].status = 'modified';
            return true;
        }

        deleteFile(repoName, filename) {
            const repo = this.repos[repoName];
            if (!repo || !repo.files[filename]) return false;

            // Mark file as deleted and stage for deletion
            repo.files[filename].status = 'deleted';
            repo.stagedFiles[filename] = { ...repo.files[filename], deleted: true };
            return true;
        }

        stageFile(repoName, filename) {
            const repo = this.repos[repoName];
            if (!repo || !repo.files[filename]) return false;
            repo.stagedFiles[filename] = { ...repo.files[filename] };
            repo.files[filename].status = 'staged';
            return true;
        }

        unstageFile(repoName, filename) {
            const repo = this.repos[repoName];
            if (!repo || !repo.stagedFiles[filename]) return false;

            const wasDeleted = repo.stagedFiles[filename].deleted;
            delete repo.stagedFiles[filename];

            if (wasDeleted) {
                // Restore the file status to clean (undo delete)
                repo.files[filename].status = 'clean';
            } else {
                // Regular unstage
                repo.files[filename].status = 'modified';
            }
            return true;
        }

        commit(repoName, message, author) {
            const repo = this.repos[repoName];
            if (!repo) return null;
            if (Object.keys(repo.stagedFiles).length === 0) return null;

            const parentOid = repo.branches[repo.head];
            const oid = this.generateOid();

            // Build commit files - start with parent commit's files or empty
            let commitFiles = {};
            if (parentOid) {
                const parentCommit = repo.commits.find(c => c.oid === parentOid);
                if (parentCommit && parentCommit.files) {
                    commitFiles = { ...parentCommit.files };
                }
            }

            // Apply staged changes
            Object.entries(repo.stagedFiles).forEach(([filename, fileData]) => {
                if (fileData.deleted) {
                    // Remove from commit files
                    delete commitFiles[filename];
                } else {
                    // Add or update in commit files
                    commitFiles[filename] = { ...fileData };
                }
            });

            const commit = {
                oid,
                message,
                author,
                timestamp: Date.now(),
                parents: parentOid ? [parentOid] : [],
                branch: repo.head,
                files: commitFiles
            };

            repo.commits.push(commit);
            repo.branches[repo.head] = oid;

            // Process staged files
            Object.keys(repo.stagedFiles).forEach(f => {
                if (repo.stagedFiles[f].deleted) {
                    // Remove deleted files from working directory
                    delete repo.files[f];
                } else {
                    // Mark non-deleted files as clean
                    repo.files[f].status = 'clean';
                }
            });
            repo.stagedFiles = {};

            return commit;
        }

        createBranch(repoName, branchName) {
            const repo = this.repos[repoName];
            if (!repo || repo.branches[branchName]) return false;

            repo.branches[branchName] = repo.branches[repo.head];
            return true;
        }

        switchBranch(repoName, branchName) {
            const repo = this.repos[repoName];
            if (!repo || !repo.branches.hasOwnProperty(branchName)) return false;

            // Switch HEAD to new branch
            repo.head = branchName;

            // Update working directory to match the branch's tip commit
            const branchTip = repo.branches[branchName];
            if (branchTip) {
                const tipCommit = repo.commits.find(c => c.oid === branchTip);
                if (tipCommit && tipCommit.files) {
                    // First, clear files that don't exist in the branch tip
                    const branchFiles = new Set(Object.keys(tipCommit.files));
                    Object.keys(repo.files).forEach(filename => {
                        if (!branchFiles.has(filename)) {
                            delete repo.files[filename];
                        }
                    });

                    // Then add/update files from the branch tip
                    Object.entries(tipCommit.files).forEach(([name, data]) => {
                        repo.files[name] = { ...data, status: 'clean' };
                    });
                }
            } else {
                // Branch has no commits yet, clear working directory
                repo.files = {};
            }

            // Clear staged files when switching branches
            repo.stagedFiles = {};

            return true;
        }

        deleteBranch(repoName, branchName) {
            const repo = this.repos[repoName];
            if (!repo || branchName === 'main' || branchName === repo.head) return false;
            delete repo.branches[branchName];
            return true;
        }

        merge(repoName, sourceBranch, author) {
            const repo = this.repos[repoName];
            if (!repo) return { ok: false, error: 'Repository not found' };

            const targetBranch = repo.head;
            if (sourceBranch === targetBranch) {
                return { ok: false, error: 'Cannot merge branch into itself' };
            }

            if (!repo.branches.hasOwnProperty(sourceBranch)) {
                return { ok: false, error: `Branch '${sourceBranch}' not found` };
            }

            const sourceCommitOid = repo.branches[sourceBranch];
            const targetCommitOid = repo.branches[targetBranch];

            if (!sourceCommitOid) {
                return { ok: false, error: 'Source branch has no commits' };
            }

            // Check if already merged (source tip is an ancestor of target)
            if (sourceCommitOid === targetCommitOid) {
                return { ok: false, error: 'Already up to date' };
            }

            // Get the files from both branch tips
            const sourceCommit = repo.commits.find(c => c.oid === sourceCommitOid);
            const targetCommit = repo.commits.find(c => c.oid === targetCommitOid);

            // Start with target branch files
            const mergedFiles = targetCommit && targetCommit.files ? { ...targetCommit.files } : {};

            // Merge in source branch files (these take precedence on conflict for simplicity)
            if (sourceCommit && sourceCommit.files) {
                Object.assign(mergedFiles, sourceCommit.files);
            }

            // Create merge commit with two parents
            const oid = this.generateOid();
            const mergeCommit = {
                oid,
                message: `Merge branch '${sourceBranch}' into ${targetBranch}`,
                author,
                timestamp: Date.now(),
                parents: [targetCommitOid, sourceCommitOid].filter(Boolean),
                branch: targetBranch,
                files: mergedFiles,
                isMerge: true
            };

            repo.commits.push(mergeCommit);
            repo.branches[targetBranch] = oid;

            // Update working directory to match merged state
            // First, clear files that don't exist in merged result
            const mergedFileNames = new Set(Object.keys(mergedFiles));
            Object.keys(repo.files).forEach(filename => {
                if (!mergedFileNames.has(filename)) {
                    delete repo.files[filename];
                }
            });

            // Then add/update files from merge
            Object.entries(mergedFiles).forEach(([name, data]) => {
                repo.files[name] = { ...data, status: 'clean' };
            });

            return { ok: true, commit: mergeCommit };
        }

        _isAncestorOf(repo, ancestorOid, descendantOid) {
            if (!ancestorOid || !descendantOid) return false;
            if (ancestorOid === descendantOid) return true;

            const visited = new Set();
            const queue = [descendantOid];

            while (queue.length > 0) {
                const currentOid = queue.shift();
                if (visited.has(currentOid)) continue;
                visited.add(currentOid);

                const commit = repo.commits.find(c => c.oid === currentOid);
                if (!commit) continue;

                for (const parentOid of (commit.parents || [])) {
                    if (parentOid === ancestorOid) return true;
                    queue.push(parentOid);
                }
            }

            return false;
        }

        getHistory(repoName) {
            const repo = this.repos[repoName];
            if (!repo) return [];
            return [...repo.commits].sort((a, b) => a.timestamp - b.timestamp);
        }

        getBranches(repoName) {
            const repo = this.repos[repoName];
            if (!repo) return [];
            return Object.keys(repo.branches);
        }

        getFiles(repoName) {
            const repo = this.repos[repoName];
            if (!repo) return [];
            return Object.entries(repo.files).map(([name, data]) => ({
                name,
                status: data.status,
                content: data.content
            }));
        }

        getStagedFiles(repoName) {
            const repo = this.repos[repoName];
            if (!repo) return [];
            return Object.keys(repo.stagedFiles);
        }
    }

    // ============================================
    // REMOTE REPOSITORY
    // ============================================

    class RemoteRepository {
        constructor() {
            this.branches = {};
            this.commits = [];
            this.initialized = false;
        }

        push(localRepo, branchName) {
            // Copy commits from local to remote
            const branchTip = localRepo.branches[branchName];
            if (!branchTip) return { ok: false, error: 'Branch not found' };

            // Check if remote has this branch
            if (this.initialized && this.branches[branchName]) {
                const remoteTip = this.branches[branchName];

                // Check if local tip is ahead of remote tip (i.e., remote tip is ancestor of local tip)
                // If remote has commits that local doesn't have, reject the push
                const isRemoteAhead = !this._isAncestorOf(localRepo, remoteTip, branchTip);

                if (isRemoteAhead && remoteTip !== branchTip) {
                    return {
                        ok: false,
                        error: 'Push rejected! Remote has changes you don\'t have. Pull first.'
                    };
                }
            }

            // Find all commits reachable from this branch
            const newCommits = localRepo.commits.filter(c =>
                !this.commits.find(rc => rc.oid === c.oid)
            );

            this.commits.push(...newCommits);
            this.branches[branchName] = branchTip;
            this.initialized = true;

            return { ok: true, pushed: newCommits.length };
        }

        _isAncestorOf(repo, ancestorOid, descendantOid) {
            if (!ancestorOid || !descendantOid) return false;
            if (ancestorOid === descendantOid) return true;

            const visited = new Set();
            const queue = [descendantOid];

            while (queue.length > 0) {
                const currentOid = queue.shift();
                if (visited.has(currentOid)) continue;
                visited.add(currentOid);

                const commit = repo.commits.find(c => c.oid === currentOid);
                if (!commit) continue;

                for (const parentOid of (commit.parents || [])) {
                    if (parentOid === ancestorOid) return true;
                    queue.push(parentOid);
                }
            }

            return false;
        }

        pull(localRepo, branchName) {
            if (!this.initialized) return { ok: false, error: 'Remote not initialized' };

            console.log('Pull: Before sync - Local main:', localRepo.branches.main ? localRepo.branches.main.substring(0, 7) : 'null');
            console.log('Pull: Remote main:', this.branches.main ? this.branches.main.substring(0, 7) : 'null');

            // Copy ALL commits from remote to local (that don't exist locally)
            const newCommits = this.commits.filter(c =>
                !localRepo.commits.find(lc => lc.oid === c.oid)
            );
            localRepo.commits.push(...newCommits);

            // Update the pulled branch pointer if it exists on remote
            if (this.branches[branchName]) {
                localRepo.branches[branchName] = this.branches[branchName];
            }

            // Sync ALL remote branches to local
            Object.keys(this.branches).forEach(remoteBranch => {
                // Always update to ensure sync (remote is source of truth for pushed branches)
                localRepo.branches[remoteBranch] = this.branches[remoteBranch];
            });

            console.log('Pull: After sync - Local main:', localRepo.branches.main ? localRepo.branches.main.substring(0, 7) : 'null');

            // Sync files from the current branch's latest commit
            if (this.branches[branchName]) {
                const branchTip = this.branches[branchName];
                const tipCommit = this.commits.find(c => c.oid === branchTip);
                if (tipCommit && tipCommit.files) {
                    // Update local working directory to match remote branch tip
                    // First, clear files that don't exist in remote tip
                    const remoteFiles = new Set(Object.keys(tipCommit.files));
                    Object.keys(localRepo.files).forEach(filename => {
                        if (!remoteFiles.has(filename)) {
                            delete localRepo.files[filename];
                        }
                    });

                    // Then add/update files from remote
                    Object.entries(tipCommit.files).forEach(([name, data]) => {
                        localRepo.files[name] = { ...data, status: 'clean' };
                    });
                }
            }

            return { ok: true, pulled: newCommits.length };
        }

        hasBranch(branchName) {
            return this.branches.hasOwnProperty(branchName);
        }

        deleteBranch(branchName) {
            if (!this.initialized) return { ok: false, error: 'Remote not initialized' };
            if (branchName === 'main') return { ok: false, error: 'Cannot delete main branch' };
            if (!this.branches[branchName]) return { ok: false, error: 'Branch not found on remote' };

            delete this.branches[branchName];
            return { ok: true };
        }

        getHistory() {
            return [...this.commits].sort((a, b) => a.timestamp - b.timestamp);
        }

        getBranches() {
            return Object.keys(this.branches);
        }
    }

    // ============================================
    // GLOBAL STATE
    // ============================================

    const gitEngine = new SimulatedGit();
    const remoteRepo = new RemoteRepository();

    const STATE = {
        users: {
            alice: { icon: '👩‍💻', color: '#E91E63', repoName: 'alice-repo' },
            bob: { icon: '👨‍💻', color: '#3F51B5', repoName: 'bob-repo' }
        }
    };

    // ============================================
    // CONSOLE LOGGER
    // ============================================

    function logConsole(message, type = 'info', isCommand = false, username = null) {
        // Determine which console to log to
        let body;
        if (username) {
            body = document.getElementById(`console-${username}`);
        }

        // If no specific console or it doesn't exist, try to detect from message
        if (!body) {
            if (message.includes('[alice]')) {
                body = document.getElementById('console-alice');
            } else if (message.includes('[bob]')) {
                body = document.getElementById('console-bob');
            }
        }

        if (!body) return;

        const ts = new Date().toLocaleTimeString();
        const div = document.createElement('div');
        div.className = `console-message ${type}`;

        // Remove the username prefix from message since console is user-specific
        let cleanMessage = message.replace(/^\[(alice|bob)\]\s*/, '');

        div.innerHTML = isCommand
            ? `<span class="timestamp">[${ts}]</span> <span class="command">$ ${cleanMessage}</span>`
            : `<span class="timestamp">[${ts}]</span> ${cleanMessage}`;

        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    // ============================================
    // STATE PERSISTENCE
    // ============================================

    const STORAGE_KEY = 'gitBetaState';

    function saveState() {
        try {
            const state = {
                gitRepos: gitEngine.repos,
                remoteRepo: {
                    branches: remoteRepo.branches,
                    commits: remoteRepo.commits,
                    initialized: remoteRepo.initialized
                },
                remoteSelectedBranch,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    }

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return false;

            const state = JSON.parse(saved);

            // Restore git repos
            gitEngine.repos = state.gitRepos;

            // Restore remote repo
            remoteRepo.branches = state.remoteRepo.branches;
            remoteRepo.commits = state.remoteRepo.commits;
            remoteRepo.initialized = state.remoteRepo.initialized;

            // Restore remote selected branch
            remoteSelectedBranch = state.remoteSelectedBranch || 'main';

            return true;
        } catch (e) {
            console.error('Failed to load state:', e);
            return false;
        }
    }

    function clearState() {
        localStorage.removeItem(STORAGE_KEY);
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        // Try to load saved state
        const loaded = loadState();

        if (!loaded) {
            // Create repos for Alice and Bob
            gitEngine.createRepo('alice-repo');
            gitEngine.createRepo('bob-repo');

            // Alice creates initial commit and pushes to remote
            gitEngine.addFile('alice-repo', 'README.md', '# Git Beta Demo\n\nShared repository for Alice and Bob.');
            gitEngine.stageFile('alice-repo', 'README.md');
            const initialCommit = gitEngine.commit('alice-repo', 'Initial commit', 'alice');

            // Alice pushes to remote
            remoteRepo.push(gitEngine.getRepo('alice-repo'), 'main');

            // Bob clones (pulls) from remote to get the shared starting point
            remoteRepo.pull(gitEngine.getRepo('bob-repo'), 'main');

            // Save initial state
            saveState();
        }

        // Setup event listeners
        setupEventListeners();

        // Render everything
        renderAll();

        // Log status only if this is a fresh start
        if (!loaded) {
            logConsole('[alice] Ready', 'info');
            logConsole('[bob] Ready', 'info');
        }
    }

    // ============================================
    // RENDERING
    // ============================================

    function renderAll() {
        Object.keys(STATE.users).forEach(username => renderWorkspace(username));
        renderRemote();
    }

    function renderWorkspace(username) {
        const user = STATE.users[username];
        const repo = gitEngine.getRepo(user.repoName);

        let workspaceEl = document.querySelector(`.user-workspace[data-user="${username}"]`);

        // Preserve console content before re-rendering
        let consoleContent = '';
        const existingConsole = document.getElementById(`console-${username}`);
        if (existingConsole) {
            consoleContent = existingConsole.innerHTML;
        }

        if (!workspaceEl) {
            workspaceEl = document.createElement('div');
            workspaceEl.className = 'user-workspace';
            workspaceEl.dataset.user = username;
            // Append to user-specific column
            const columnId = `${username}-column`;
            const column = document.getElementById(columnId);
            if (column) {
                column.appendChild(workspaceEl);
            }
        }

        const files = gitEngine.getFiles(user.repoName);
        const stagedFiles = gitEngine.getStagedFiles(user.repoName);
        const branches = gitEngine.getBranches(user.repoName);
        const history = gitEngine.getHistory(user.repoName);

        workspaceEl.innerHTML = `
            <div class="workspace-row header-row workspace-header">
                <div class="workspace-user-info">
                    <span class="workspace-user-icon">${user.icon}</span>
                    <div>
                        <h3 class="workspace-user-name">${username}</h3>
                        <div class="workspace-status">
                            <span class="status-indicator" style="background-color: ${user.color}"></span>
                            <span>Branch: <strong>${repo.head}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="workspace-row branches-row workspace-section branch-section">
                <div class="section-title">🌿 Branches</div>
                <div class="branch-list">
                    ${branches.map(b => {
                        const isOnRemote = remoteRepo.hasBranch(b);
                        return `
                        <div class="branch-item ${b === repo.head ? 'active' : ''}">
                            <span class="branch-name" onclick="window.gitBeta.switchBranch('${username}', '${b}')">${b}</span>
                            ${isOnRemote ? '<span class="branch-remote-indicator" title="On remote">☁️</span>' : ''}
                            ${b !== 'main' && b !== repo.head ? `<button class="branch-delete-btn" onclick="window.gitBeta.deleteBranch('${username}', '${b}')" title="Delete local">×</button>` : ''}
                            ${b !== 'main' && b !== repo.head && isOnRemote ? `<button class="branch-push-delete-btn" onclick="window.gitBeta.pushDeleteBranch('${username}', '${b}')" title="Delete from remote">☁️×</button>` : ''}
                        </div>
                    `}).join('')}
                    <button class="branch-add-btn" onclick="window.gitBeta.createBranch('${username}')">+ New</button>
                </div>
            </div>

            <div class="workspace-row working-dir-row workspace-section">
                <div class="section-title">📂 Working Directory</div>
                <div class="working-directory">
                    ${files.length === 0 ? '<div class="empty-state">No files</div>' : files.map(file => `
                        <div class="file-item">
                            <div class="file-info">
                                <span class="file-icon">📄</span>
                                <span class="file-name ${file.status === 'deleted' ? 'file-deleted' : ''}">${file.name}</span>
                                <span class="file-status ${file.status}">${file.status}</span>
                            </div>
                            <div class="file-actions">
                                ${file.status !== 'staged' && file.status !== 'clean' && file.status !== 'deleted' ?
                                    `<button class="file-btn primary" onclick="window.gitBeta.stage('${username}', '${file.name}')">+Stage</button>` : ''
                                }
                                ${file.status === 'staged' || file.status === 'deleted' ?
                                    `<button class="file-btn" onclick="window.gitBeta.unstage('${username}', '${file.name}')">↩️ Unstage</button>` : ''
                                }
                                ${file.status === 'clean' ? `<button class="file-btn" onclick="window.gitBeta.modify('${username}', '${file.name}')">✏️ Modify</button>` : ''}
                                ${file.status === 'clean' || file.status === 'modified' ? `<button class="file-btn danger" onclick="window.gitBeta.deleteFile('${username}', '${file.name}')">🗑️ Delete</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                    <div class="add-file-form">
                        <input type="text" class="add-file-input" placeholder="filename.txt" id="new-file-${username}">
                        <button class="file-btn primary" onclick="window.gitBeta.addFile('${username}')">➕ Add</button>
                    </div>
                </div>
            </div>

            <div class="workspace-row actions-row workspace-section">
                <div class="action-buttons">
                    ${stagedFiles.length > 0 ? `<button class="action-btn success" onclick="window.gitBeta.commit('${username}')">✅ Commit (${stagedFiles.length})</button>` : ''}
                    <button class="action-btn success" onclick="window.gitBeta.push('${username}')">⬆️ Push</button>
                    <button class="action-btn" onclick="window.gitBeta.pull('${username}')">⬇️ Pull</button>
                    ${branches.length > 1 ? `<button class="action-btn merge" onclick="window.gitBeta.merge('${username}')">🔀 Merge</button>` : ''}
                </div>
            </div>

            <div class="workspace-row graph-row local-network-section">
                <div class="local-network-title">📊 Local Graph</div>
                <svg class="local-network-svg" id="local-network-${username}"></svg>
            </div>

            <div class="workspace-row console-row user-console-section">
                <div class="console-header">
                    <span class="console-title">$> Console</span>
                    <button class="console-clear-btn" onclick="window.gitBeta.clearConsole('${username}')">Clear</button>
                </div>
                <div class="console-body" id="console-${username}">${consoleContent}</div>
            </div>
        `;

        renderGraph(d3.select(`#local-network-${username}`), history, branches, user.color, repo.branches);
    }

    // Track selected branch for remote view
    let remoteSelectedBranch = 'main';

    function renderRemote() {
        const remoteBody = document.getElementById('remote-body');
        const remoteStatus = document.getElementById('remote-status');
        const remoteFiles = document.getElementById('remote-files');
        const remoteBranchLabel = document.getElementById('remote-selected-branch');
        const svg = d3.select('#remote-network-svg');
        svg.selectAll('*').remove();

        const branches = remoteRepo.getBranches();
        const history = remoteRepo.getHistory();

        if (!remoteRepo.initialized) {
            remoteStatus.textContent = 'Not initialized';
            remoteBody.innerHTML = '<div class="empty-state">Push to create</div>';
            if (remoteFiles) remoteFiles.innerHTML = '<div class="empty-state">No files yet</div>';
            if (remoteBranchLabel) remoteBranchLabel.textContent = 'main';
            svg.attr('height', 50).append('text')
                .attr('x', '50%').attr('y', 25)
                .attr('text-anchor', 'middle')
                .attr('fill', 'var(--bs-secondary-color, #6c757d)')
                .text('Push to see commits');
            return;
        }

        // Ensure selected branch exists
        if (!branches.includes(remoteSelectedBranch)) {
            remoteSelectedBranch = 'main';
        }

        remoteStatus.textContent = `${branches.length} branch(es)`;

        // Render clickable branches
        remoteBody.innerHTML = branches.map(b => `
            <div class="remote-branch-item ${b === remoteSelectedBranch ? 'active' : ''}" 
                 onclick="window.gitBeta.selectRemoteBranch('${b}')">
                🌿 ${b}
            </div>
        `).join('');

        // Update branch label
        if (remoteBranchLabel) {
            remoteBranchLabel.textContent = remoteSelectedBranch;
        }

        // Render files from selected branch
        if (remoteFiles) {
            const branchTip = remoteRepo.branches[remoteSelectedBranch];
            const filesOnBranch = getFilesFromBranch(remoteSelectedBranch);

            if (filesOnBranch.length === 0) {
                remoteFiles.innerHTML = '<div class="empty-state">No files on this branch</div>';
            } else {
                remoteFiles.innerHTML = filesOnBranch.map(filename => `
                    <div class="remote-file-item">
                        <span class="file-icon">📄</span>
                        <span class="file-name">${filename}</span>
                    </div>
                `).join('');
            }
        }

        renderGraph(svg, history, branches, '#9C27B0', remoteRepo.branches);
    }

    // Get files from a specific branch on remote
    function getFilesFromBranch(branchName) {
        const branchTip = remoteRepo.branches[branchName];
        if (!branchTip) return [];

        // Get files from the tip commit only (current state of the branch)
        const tipCommit = remoteRepo.commits.find(c => c.oid === branchTip);
        if (!tipCommit || !tipCommit.files) return [];

        return Object.keys(tipCommit.files).sort();
    }

    // ============================================
    // TOPOLOGICAL SORT FOR COMMITS
    // ============================================

    function topologicalSort(commits) {
        if (!commits || commits.length === 0) return [];

        // Build a map for quick lookup
        const commitMap = {};
        commits.forEach(c => { commitMap[c.oid] = c; });

        // Calculate depth (distance from root) for each commit
        const depth = {};

        function getDepth(oid) {
            if (depth[oid] !== undefined) return depth[oid];
            const commit = commitMap[oid];
            if (!commit || !commit.parents || commit.parents.length === 0) {
                depth[oid] = 0;
                return 0;
            }

            let maxParentDepth = -1;
            for (const parentOid of commit.parents) {
                if (commitMap[parentOid]) {
                    maxParentDepth = Math.max(maxParentDepth, getDepth(parentOid));
                }
            }
            depth[oid] = maxParentDepth + 1;
            return depth[oid];
        }

        // Calculate depth for all commits
        commits.forEach(c => getDepth(c.oid));

        // Sort by depth first, then by timestamp, then by oid for stability
        return [...commits].sort((a, b) => {
            const depthA = depth[a.oid] || 0;
            const depthB = depth[b.oid] || 0;
            if (depthA !== depthB) return depthA - depthB;
            if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
            return a.oid.localeCompare(b.oid);
        });
    }

    // ============================================
    // GRAPH RENDERING (D3)
    // ============================================

    // Track all branches that have ever existed (for lane preservation)
    const allHistoricalBranches = new Map(); // Map<repoId, Set<branchName>>

    function renderGraph(svg, commits, branches, defaultColor, branchPointers = {}) {
        svg.selectAll('*').remove();

        if (!commits || !commits.length) {
            svg.attr('height', 50).append('text')
                .attr('x', '50%').attr('y', 25)
                .attr('text-anchor', 'middle')
                .attr('fill', 'var(--bs-secondary-color, #6c757d)')
                .text('No commits yet');
            return;
        }

        console.log('renderGraph - main pointer:', branchPointers.main ? branchPointers.main.substring(0, 7) : 'null');


        const nodeRadius = 8, nodeSpacingY = 40, branchSpacingX = 80, startX = 50, startY = 50;

        // Sort commits topologically (parents before children) with timestamp as secondary
        const sortedCommits = topologicalSort(commits);

        // Determine repository ID from svg element
        const svgId = svg.attr('id') || 'default';

        // Track all branches that have ever had commits
        if (!allHistoricalBranches.has(svgId)) {
            allHistoricalBranches.set(svgId, new Set());
        }
        const historicalBranches = allHistoricalBranches.get(svgId);

        // Add all branches from commits to historical tracking
        commits.forEach(c => {
            if (c.branch) historicalBranches.add(c.branch);
        });

        // Add current active branches
        branches.forEach(b => historicalBranches.add(b));

        // Create combined list: active branches + deleted branches
        const allBranches = Array.from(historicalBranches);
        const deletedBranches = allBranches.filter(b => !branches.includes(b));

        // Assign lanes to all branches (preserving deleted ones)
        const branchLane = {};
        const sortedBranches = [...allBranches].sort((a, b) => a === 'main' ? -1 : b === 'main' ? 1 : a.localeCompare(b));
        sortedBranches.forEach((b, i) => { branchLane[b] = i; });

        // Calculate positions
        const commitPos = {};
        sortedCommits.forEach((c, i) => {
            const lane = branchLane[c.branch] || 0;
            commitPos[c.oid] = { x: startX + lane * branchSpacingX, y: startY + i * nodeSpacingY };
        });

        // Set SVG size - use allBranches instead of just active branches for width
        const h = Math.max(150, sortedCommits.length * nodeSpacingY + 70);
        const w = Math.max(200, allBranches.length * branchSpacingX + 150);
        svg.attr('width', w).attr('height', h);

        // Define arrow markers
        const colors = ['#1E88E5', '#4CAF50', '#9C27B0', '#F44336'];
        const defs = svg.append('defs');
        colors.forEach((color, i) => {
            defs.append('marker')
                .attr('id', `arrow-${i}-${svg.attr('id') || 'default'}`)
                .attr('viewBox', '0 -4 8 8')
                .attr('refX', 6).attr('refY', 0)
                .attr('markerWidth', 5).attr('markerHeight', 5)
                .attr('orient', 'auto')
                .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', color);
        });

        // Draw branch labels (including deleted branches)
        const labels = svg.append('g');
        sortedBranches.forEach((name, i) => {
            const x = startX + i * branchSpacingX;
            const isDeleted = deletedBranches.includes(name);
            const lw = Math.max(name.length * 6 + 8, 35);

            labels.append('rect')
                .attr('x', x - lw/2).attr('y', 6)
                .attr('width', lw).attr('height', 14)
                .attr('rx', 3)
                .attr('fill', isDeleted ? '#999' : (name === 'main' ? colors[0] : colors[1]))
                .attr('opacity', isDeleted ? 0.5 : 1);

            const labelText = labels.append('text')
                .attr('x', x).attr('y', 16)
                .attr('text-anchor', 'middle')
                .attr('font-size', '8px')
                .attr('fill', 'white')
                .attr('font-weight', 'bold')
                .attr('opacity', isDeleted ? 0.7 : 1)
                .text(name);

            // Add strikethrough for deleted branches
            if (isDeleted) {
                labels.append('line')
                    .attr('x1', x - lw/2 + 2).attr('y1', 13)
                    .attr('x2', x + lw/2 - 2).attr('y2', 13)
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1)
                    .attr('opacity', 0.7);
            }
        });

        // Draw edges
        const edges = svg.append('g');
        sortedCommits.forEach(c => {
            const pos = commitPos[c.oid];
            if (!pos || !c.parents) return;

            c.parents.forEach((parentOid, i) => {
                const pPos = commitPos[parentOid];
                if (!pPos) return;

                const lane = branchLane[c.branch] || 0;
                const color = colors[lane % colors.length];
                const arrowId = `arrow-${lane % colors.length}-${svg.attr('id') || 'default'}`;

                if (pPos.x === pos.x) {
                    edges.append('line')
                        .attr('x1', pos.x).attr('y1', pos.y - nodeRadius)
                        .attr('x2', pPos.x).attr('y2', pPos.y + nodeRadius)
                        .attr('stroke', color).attr('stroke-width', 2)
                        .attr('marker-end', `url(#${arrowId})`);
                } else {
                    const midY = (pPos.y + pos.y) / 2;
                    edges.append('path')
                        .attr('d', `M ${pos.x} ${pos.y - nodeRadius} C ${pos.x} ${midY}, ${pPos.x} ${midY}, ${pPos.x} ${pPos.y + nodeRadius}`)
                        .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2)
                        .attr('marker-end', `url(#${arrowId})`);
                }
            });
        });

        // Build a map of which branches point to which commits
        const commitToBranches = {};
        Object.entries(branchPointers).forEach(([branchName, commitOid]) => {
            if (!commitOid) return;
            if (!commitToBranches[commitOid]) {
                commitToBranches[commitOid] = [];
            }
            commitToBranches[commitOid].push(branchName);
        });

        // Draw nodes
        const nodes = svg.append('g');
        sortedCommits.forEach(c => {
            const pos = commitPos[c.oid];
            if (!pos) return;

            const user = STATE.users[c.author];
            const color = user ? user.color : defaultColor;

            const g = nodes.append('g')
                .attr('transform', `translate(${pos.x},${pos.y})`)
                .style('cursor', 'pointer')
                .on('click', () => showCommitModal(c));

            // Add tooltip with parent info
            const parentInfo = c.parents && c.parents.length > 0
                ? `Parent: ${c.parents.map(p => p.substring(0, 7)).join(', ')}`
                : 'Root commit (no parent)';
            g.append('title').text(`${c.oid.substring(0, 7)} - ${c.message}\n${parentInfo}`);

            g.append('circle')
                .attr('r', nodeRadius)
                .attr('fill', color)
                .attr('stroke', '#fff')
                .attr('stroke-width', 2);

            g.append('text')
                .attr('x', 15).attr('y', -1)
                .attr('font-size', '8px')
                .attr('font-family', 'monospace')
                .attr('fill', 'var(--bs-body-color)')
                .text(c.oid.substring(0, 7));

            // Show parent info
            const parentText = c.parents && c.parents.length > 0
                ? `← ${c.parents[0].substring(0, 7)}`
                : '(root)';
            g.append('text')
                .attr('x', 15).attr('y', 9)
                .attr('font-size', '7px')
                .attr('fill', 'var(--bs-secondary-color, #6c757d)')
                .text(parentText);

            const msg = c.message.length > 12 ? c.message.substring(0, 10) + '...' : c.message;
            g.append('text')
                .attr('x', 15).attr('y', 19)
                .attr('font-size', '6px')
                .attr('fill', 'var(--bs-secondary-color, #6c757d)')
                .text(msg);

            // Draw branch pointers for this commit
            const branchesAtCommit = commitToBranches[c.oid];
            if (branchesAtCommit && branchesAtCommit.length > 0) {
                const branchGroup = g.append('g');
                let yOffset = 30; // Start below the commit message

                branchesAtCommit.forEach((branchName, idx) => {
                    const lane = branchLane[branchName] || 0;
                    const branchColor = colors[lane % colors.length];
                    const textWidth = branchName.length * 5.5;

                    // Draw rounded rectangle background
                    branchGroup.append('rect')
                        .attr('x', 15)
                        .attr('y', yOffset - 7)
                        .attr('width', textWidth + 6)
                        .attr('height', 10)
                        .attr('rx', 2)
                        .attr('fill', branchColor)
                        .attr('opacity', 0.9);

                    // Draw branch name text
                    branchGroup.append('text')
                        .attr('x', 18)
                        .attr('y', yOffset)
                        .attr('font-size', '7px')
                        .attr('font-weight', 'bold')
                        .attr('fill', 'white')
                        .text(branchName);

                    yOffset += 12; // Move down for next branch
                });
            }
        });
    }

    // ============================================
    // COMMIT MODAL
    // ============================================

    function showCommitModal(commit) {
        const modal = document.getElementById('commit-modal');
        const body = document.getElementById('commit-modal-body');
        const title = document.getElementById('commit-modal-title');

        if (!modal || !body) {
            alert(`Commit: ${commit.oid.substring(0, 7)}\nMessage: ${commit.message}\nAuthor: ${commit.author}`);
            return;
        }

        title.textContent = `Commit ${commit.oid.substring(0, 7)}`;

        body.innerHTML = `
            <div class="commit-detail-row"><strong>SHA:</strong> <span>${commit.oid}</span></div>
            <div class="commit-detail-row"><strong>Author:</strong> <span>${commit.author}</span></div>
            <div class="commit-detail-row"><strong>Branch:</strong> <span>${commit.branch}</span></div>
            <div class="commit-detail-row"><strong>Date:</strong> <span>${new Date(commit.timestamp).toLocaleString()}</span></div>
            ${commit.parents && commit.parents.length > 0 ? 
                `<div class="commit-detail-row"><strong>Parents:</strong> <span>${commit.parents.map(p => p.substring(0, 7)).join(', ')}</span></div>` : ''
            }
            <div class="commit-detail-row"><strong>Files:</strong> <span>${Object.keys(commit.files).join(', ')}</span></div>
            <div class="commit-detail-message"><strong>Message:</strong><br>${commit.message}</div>
        `;

        modal.classList.add('show');
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    function setupEventListeners() {

        // Reset all
        document.getElementById('reset-all-btn')?.addEventListener('click', () => {
            if (confirm('Reset all? This will clear all repositories and saved state.')) {
                clearState();
                location.reload();
            }
        });

        // Modal close
        document.getElementById('commit-modal-close')?.addEventListener('click', () => {
            document.getElementById('commit-modal').classList.remove('show');
        });

        document.getElementById('commit-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'commit-modal') {
                document.getElementById('commit-modal').classList.remove('show');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('commit-modal')?.classList.remove('show');
            }
        });

        // Enter key for file input
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('add-file-input')) {
                const username = e.target.id.replace('new-file-', '');
                if (STATE.users[username]) {
                    window.gitBeta.addFile(username);
                }
            }
        });
    }

    // ============================================
    // GLOBAL API
    // ============================================

    window.gitBeta = {
        addFile: (username) => {
            const input = document.getElementById(`new-file-${username}`);
            if (!input || !input.value.trim()) return;

            const user = STATE.users[username];
            const filename = input.value.trim();

            if (gitEngine.addFile(user.repoName, filename, `// ${filename}\n// Created by ${username}`)) {
                logConsole(`[${username}] Created file: ${filename}`, 'success');
                input.value = '';
                saveState();
                renderWorkspace(username);
            }
        },

        modify: (username, filename) => {
            const user = STATE.users[username];
            if (gitEngine.modifyFile(user.repoName, filename)) {
                logConsole(`[${username}] Modified file: ${filename}`, 'info');
                saveState();
                renderWorkspace(username);
            }
        },

        deleteFile: (username, filename) => {
            if (!confirm(`Delete "${filename}"? This will be staged for commit.`)) return;

            const user = STATE.users[username];
            if (gitEngine.deleteFile(user.repoName, filename)) {
                logConsole(`[${username}] git rm ${filename}`, 'warning', true);
                logConsole(`[${username}] Deleted and staged: ${filename}`, 'warning');
                saveState();
                renderWorkspace(username);
            }
        },

        stage: (username, filename) => {
            const user = STATE.users[username];
            if (gitEngine.stageFile(user.repoName, filename)) {
                logConsole(`[${username}] git add ${filename}`, 'success', true);
                saveState();
                renderWorkspace(username);
            }
        },

        unstage: (username, filename) => {
            const user = STATE.users[username];
            const repo = gitEngine.getRepo(user.repoName);
            const wasDeleted = repo.stagedFiles[filename] && repo.stagedFiles[filename].deleted;

            if (gitEngine.unstageFile(user.repoName, filename)) {
                if (wasDeleted) {
                    logConsole(`[${username}] Restored: ${filename}`, 'info');
                } else {
                    logConsole(`[${username}] Unstaged: ${filename}`, 'info');
                }
                saveState();
                renderWorkspace(username);
            }
        },

        commit: (username) => {
            const msg = prompt('Commit message:', 'Update files');
            if (!msg) return;

            const user = STATE.users[username];
            const commit = gitEngine.commit(user.repoName, msg, username);

            if (commit) {
                logConsole(`[${username}] git commit -m "${msg}"`, 'success', true);
                logConsole(`[${username}] Created commit: ${commit.oid.substring(0, 7)}`, 'success');
                saveState();
                renderAll();
            } else {
                logConsole(`[${username}] Nothing to commit`, 'warning');
            }
        },

        push: (username) => {
            const user = STATE.users[username];
            const repo = gitEngine.getRepo(user.repoName);

            logConsole(`[${username}] git push origin ${repo.head}`, 'info', true);

            const result = remoteRepo.push(repo, repo.head);
            if (result.ok) {
                logConsole(`[${username}] Push successful (${result.pushed} commit(s))`, 'success');
                saveState();
                renderAll(); // Render all workspaces and remote so graphs sync
            } else {
                logConsole(`[${username}] Push failed: ${result.error}`, 'error');
            }
        },

        pull: (username) => {
            const user = STATE.users[username];
            const repo = gitEngine.getRepo(user.repoName);

            logConsole(`[${username}] git fetch --all && git pull`, 'info', true);

            // Pull using current branch, but this will fetch ALL commits
            const result = remoteRepo.pull(repo, repo.head);
            if (result.ok) {
                logConsole(`[${username}] Pull successful (${result.pulled} commit(s))`, 'success');
                saveState();
                renderAll(); // Render all workspaces and remote so graphs sync
            } else {
                logConsole(`[${username}] Pull failed: ${result.error}`, 'error');
            }
        },

        createBranch: (username) => {
            const name = prompt('New branch name:');
            if (!name) return;

            // Check if branch already exists on remote
            if (remoteRepo.hasBranch(name)) {
                logConsole(`[${username}] Branch '${name}' already exists on remote`, 'error');
                return;
            }

            const user = STATE.users[username];
            if (gitEngine.createBranch(user.repoName, name)) {
                logConsole(`[${username}] git branch ${name}`, 'success', true);
                gitEngine.switchBranch(user.repoName, name);
                logConsole(`[${username}] git checkout ${name}`, 'success', true);
                saveState();
                renderWorkspace(username);
            } else {
                logConsole(`[${username}] Branch already exists locally`, 'error');
            }
        },

        switchBranch: (username, branch) => {
            const user = STATE.users[username];
            if (gitEngine.switchBranch(user.repoName, branch)) {
                logConsole(`[${username}] git checkout ${branch}`, 'success', true);
                saveState();
                renderWorkspace(username);
            }
        },

        deleteBranch: (username, branch) => {
            if (!confirm(`Delete branch "${branch}"?`)) return;

            const user = STATE.users[username];
            if (gitEngine.deleteBranch(user.repoName, branch)) {
                logConsole(`[${username}] git branch -d ${branch}`, 'success', true);
                logConsole(`[${username}] Deleted local branch '${branch}'`, 'success');

                if (remoteRepo.hasBranch(branch)) {
                    logConsole(`[${username}] Note: Branch still exists on remote. Use "Push Delete" to remove it.`, 'info');
                }

                saveState();
                renderWorkspace(username);
            } else {
                logConsole(`[${username}] Cannot delete branch`, 'error');
            }
        },

        pushDeleteBranch: (username, branch) => {
            if (!confirm(`Delete branch "${branch}" from remote?`)) return;

            const user = STATE.users[username];
            const result = remoteRepo.deleteBranch(branch);

            if (result.ok) {
                logConsole(`[${username}] git push origin --delete ${branch}`, 'success', true);
                logConsole(`[${username}] Deleted branch '${branch}' from remote`, 'success');
                saveState();
                renderAll();
            } else {
                logConsole(`[${username}] ${result.error}`, 'error');
            }
        },

        merge: (username) => {
            const user = STATE.users[username];
            const repo = gitEngine.getRepo(user.repoName);
            const branches = gitEngine.getBranches(user.repoName);
            const otherBranches = branches.filter(b => b !== repo.head);

            if (otherBranches.length === 0) {
                logConsole(`[${username}] No other branches to merge`, 'warning');
                return;
            }

            const sourceBranch = prompt(`Merge which branch into '${repo.head}'?\nAvailable: ${otherBranches.join(', ')}`);
            if (!sourceBranch) return;

            if (!otherBranches.includes(sourceBranch)) {
                logConsole(`[${username}] Branch '${sourceBranch}' not found`, 'error');
                return;
            }

            logConsole(`[${username}] git merge ${sourceBranch}`, 'info', true);

            const result = gitEngine.merge(user.repoName, sourceBranch, username);
            if (result.ok) {
                logConsole(`[${username}] Merge successful: ${result.commit.oid.substring(0, 7)}`, 'success');
                logConsole(`[${username}] Merged '${sourceBranch}' into '${repo.head}'`, 'success');
                saveState();
                renderAll();
            } else {
                logConsole(`[${username}] Merge failed: ${result.error}`, 'error');
            }
        },

        clearConsole: (username) => {
            const consoleEl = document.getElementById(`console-${username}`);
            if (consoleEl) {
                consoleEl.innerHTML = '';
            }
        },

        selectRemoteBranch: (branchName) => {
            remoteSelectedBranch = branchName;
            saveState();
            renderRemote();
        }
    };

    // ============================================
    // START
    // ============================================

    document.addEventListener('DOMContentLoaded', init);

})();

