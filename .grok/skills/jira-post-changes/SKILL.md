---
name: jira-post-changes
description: >
  Post detailed implementation change summaries as Jira issue comments using the Atlassian MCP.
  For Bug issues, posts two separate comments: a Root Cause Analysis (RCA) comment and a
  Detailed Changes comment. For all other issue types, posts a single Detailed Changes comment.
  Use when the user asks to document changes on a Jira ticket, post implementation details,
  write a fix summary, add an RCA, close out a ticket with change notes, or runs /jira-post-changes.
---

# Jira Post Changes

Post structured, detailed change documentation to a Jira issue. **Bug tickets always get two comments** — RCA first, then Detailed Changes. All other types get one Detailed Changes comment.

## Keywords

jira comment, post changes, document changes, implementation summary, fix summary, RCA, root cause analysis, close out ticket, update jira, write change notes, what changed, /jira-post-changes

## When to Use

- User finished work and wants change details on the Jira ticket
- User asks for an RCA on a bug fix
- User says "post this to JIRA", "comment on ZC-21", "document the fix"
- Closing out or transitioning a ticket and needs a written record of what changed

**Do NOT use for:** triaging new bugs (`triage-issue`), creating tickets, status reports, or general knowledge search.

---

## Workflow

### Step 1: Resolve the Jira Issue

1. **Identify the issue key** from the user's message, branch name (e.g. `feature/ZC-21-setup-wizard` → `ZC-21`), or PR title.
2. If unclear, ask: *"Which Jira issue should I post to? (e.g. ZC-21)"*
3. **Get cloudId** — call `getAccessibleAtlassianResources` if not known. If the user gave an Atlassian URL, try the site hostname as `cloudId` first.
4. **Fetch the issue:**

```
getJiraIssue(
  cloudId="<cloudId>",
  issueIdOrKey="<KEY>",
  fields=["summary", "description", "status", "issuetype", "priority", "assignee", "comment"]
)
```

5. Note `issuetype.name` — this determines whether to post one or two comments.

---

### Step 2: Gather Change Details

Collect information from **all available sources** before drafting:

| Source | What to extract |
|--------|-----------------|
| `git diff` / `git log` | Files changed, commit messages, logical groupings |
| Conversation / plan | Intent, decisions, edge cases handled |
| Tests run | Commands, pass/fail, coverage of scenarios |
| PR / branch | Link if available |

Run locally when in a git repo:

```bash
git log --oneline <base>..HEAD
git diff --stat <base>..HEAD
git diff <base>..HEAD
```

Use `main` or `master` as base unless the user specifies otherwise. If the branch embeds the issue key, use that branch's commits as the primary scope.

**Quality bar:** Every changed area should explain *what* changed and *why*. Avoid raw diffs — summarize in plain language. Group related file changes under one bullet.

---

### Step 3: Draft Comments

Use templates from `references/comment-templates.md`. Adapt section headings to match team conventions if the issue's existing comments show a preferred format.

#### Bug issues → TWO comments

**Comment A — Root Cause Analysis** (post first)

Focus on diagnosis, not implementation. Include:
- What broke and observable symptoms
- Root cause (the underlying defect, not the symptom)
- Contributing factors (config, race condition, missing validation, etc.)
- How it was found / reproduced
- Prevention notes (optional, brief)

**Do NOT include** file lists, code diffs, or step-by-step implementation in the RCA.

**Comment B — Detailed Changes** (post second)

Focus on the fix delivery. Include:
- High-level summary (1–2 sentences)
- Changes by area (grouped bullets with file paths)
- Testing performed
- Risks / follow-ups (if any)
- Links (PR, commits, docs)

#### Non-Bug issues (Story, Task, Epic, etc.) → ONE comment

Post **Detailed Changes** only. No RCA section.

---

### Step 4: Preview and Confirm

**CRITICAL:** Show the full draft comment(s) to the user before posting. Format:

```
Ready to post to **ZC-21** (Bug): *Setup wizard redirects before config saved*

---

**Comment 1 — Root Cause Analysis**
[full draft]

---

**Comment 2 — Detailed Changes**
[full draft]

---

Post both comments to ZC-21? (yes / edit / cancel)
```

For non-Bug issues, show a single comment preview.

Wait for explicit approval. If the user requests edits, revise and re-preview.

---

### Step 5: Post to Jira

After approval, post comments via Atlassian MCP. **Read tool schemas** in `mcps/atlassian/tools/` before calling.

**Bug — post RCA first, then Detailed Changes:**

```
addCommentToJiraIssue(
  cloudId="<cloudId>",
  issueIdOrKey="<KEY>",
  commentBody="<RCA markdown>",
  contentFormat="markdown"
)

addCommentToJiraIssue(
  cloudId="<cloudId>",
  issueIdOrKey="<KEY>",
  commentBody="<Detailed Changes markdown>",
  contentFormat="markdown"
)
```

**Non-Bug — single comment:**

```
addCommentToJiraIssue(
  cloudId="<cloudId>",
  issueIdOrKey="<KEY>",
  commentBody="<Detailed Changes markdown>",
  contentFormat="markdown"
)
```

Post as **separate API calls** — never combine RCA and Detailed Changes into one comment on Bug tickets.

---

### Step 6: Confirm to User

```
Posted to **ZC-21**: https://<site>.atlassian.net/browse/ZC-21

- Comment 1: Root Cause Analysis
- Comment 2: Detailed Changes

(or, for non-Bug: "Comment: Detailed Changes")
```

---

## Edge Cases

### Issue type is Bug but RCA info is missing

Ask the user for root cause details before drafting. Minimum needed:
- What was the root cause?
- How was it discovered?

Do not invent an RCA. A placeholder like "TBD" is unacceptable.

### Issue already has similar comments

Check `fields.comment.comments` from `getJiraIssue`. If an RCA or change summary already exists:
- Tell the user what was found
- Ask: update existing comment (`commentId` param) or add a new one

### Sub-task or linked parent

Post to the issue the user specified. If they fixed a Bug via a sub-task, ask whether to post on the sub-task, parent Bug, or both.

### No git changes

Draft from conversation context only. Note in the comment that changes are described from implementation notes (no git diff available).

### Custom visibility

If the user requests an internal-only comment, use `commentVisibility` per the `addCommentToJiraIssue` schema.

---

## Quality Checklist

Before posting, verify:

- [ ] Issue key and type confirmed
- [ ] Bug → two separate comments; non-Bug → one comment
- [ ] RCA explains *why* it broke, not *what* files changed
- [ ] Detailed Changes lists concrete modifications with file paths
- [ ] Testing section reflects what was actually run
- [ ] User approved the preview
- [ ] Comments use markdown (`contentFormat: "markdown"`)

---

## Quick Reference

| Issue Type | Comments Posted |
|------------|-----------------|
| Bug | 1. RCA → 2. Detailed Changes |
| Story, Task, Epic, other | 1. Detailed Changes |

**Tools:** `getAccessibleAtlassianResources`, `getJiraIssue`, `addCommentToJiraIssue`

**Templates:** `references/comment-templates.md`