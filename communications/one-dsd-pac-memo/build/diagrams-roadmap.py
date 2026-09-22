import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

NAVY = "#003865"
BLACK = "#111110"
MUTED = "#5A5A57"
LINE = "#DDDDD9"
PANEL = "#F5F5F3"
WHITE = "#FFFFFF"
plt.rcParams["font.family"] = "DejaVu Sans"
plt.rcParams["text.color"] = BLACK

OUT = "/tmp/claude-0/-home-user-one-dhs-equity-resource/41be875d-a25e-5ef4-a520-759436e73a12/scratchpad/roadmap"

# ============================================================
# Diagram 1: three-year swimlane (Gantt), fixed durations + tick labels
# ============================================================
WS = [
 ("1", "Keep the Program current & ready", 0, 36, "ongoing"),
 ("2", "Launch throughout the Division", 0, 3, "phase"),
 ("3", "Governance & leadership accountability", 1, 8, "phase"),
 ("10", "One DSD Team & Amplify Equity", 3, 15, "phase"),
 ("6", "Learning, leadership competencies & IDI", 4, 24, "phase"),
 ("4", "Assessment, data baseline & accountability", 6, 30, "phase"),
 ("5", "Vision, working groups & communications", 6, 18, "phase"),
 ("7", "Equity analysis in everyday decisions", 9, 24, "phase"),
 ("8", "Community engagement & service delivery", 9, 27, "phase"),
 ("9", "The legislative dimension", 12, 24, "phase"),
]
MILESTONES = [(0, "Launch\nJan 2027"), (12, "Year 1\nreview"), (24, "Year 2\nreview"),
              (30, "2029\nassessment"), (36, "Year 3\nclose")]
N = len(WS)
fig, ax = plt.subplots(figsize=(11.8, 5.8), dpi=220)
bar_h = 0.52
for i, (num, label, start, dur, kind) in enumerate(WS):
    y = N - 1 - i
    ax.barh(y, dur, left=start, height=bar_h, color=NAVY, edgecolor="none", zorder=3)
    if kind == "ongoing":
        ax.barh(y, dur - 3, left=start + 3, height=bar_h, facecolor="none",
                edgecolor=WHITE, hatch="////", linewidth=0, zorder=4, alpha=0.35)
    ax.text(-0.6, y, f"{num}.", ha="right", va="center", fontsize=9.5, fontweight="bold", color=NAVY)
    ax.text(39, y, label, ha="left", va="center", fontsize=8.4, color=BLACK)

for m, lab in MILESTONES:
    ax.axvline(m, color=LINE, linewidth=1, zorder=1)
    ax.text(m, N + 0.35, lab, ha="center", va="bottom", fontsize=7.6, color=MUTED, linespacing=1.15)
for yy in range(1, 3):
    ax.axvline(yy * 12, color=NAVY, linewidth=1.1, linestyle=(0, (1, 2)), zorder=2, alpha=0.55)
    ax.text(yy * 12, -1.05, f"Year {yy} → Year {yy+1}", ha="center", va="top", fontsize=7.6, color=MUTED)

ax.set_xlim(-0.6, 58)
ax.set_ylim(-1.6, N + 1.1)
ax.set_yticks([])
xticks = list(range(0, 37, 3))
xlabels = []
for m in xticks:
    total_q = m // 3          # quarters elapsed since Q1 2027
    if m == 36:                # right edge = the end of Q4 2029, not the start of Q1 2030
        xlabels.append("Q4\n2029")
        continue
    yr = 2027 + total_q // 4
    q = total_q % 4 + 1
    xlabels.append(f"Q{q}\n{yr}")
ax.set_xticks(xticks)
ax.set_xticklabels(xlabels, fontsize=7.3, color=MUTED)
for spine in ["top", "right", "left"]:
    ax.spines[spine].set_visible(False)
ax.spines["bottom"].set_color(LINE)
ax.tick_params(axis="x", length=0)
ax.set_title("Three-year roadmap by workstream, January 2027 – December 2029",
             fontsize=12.5, color=NAVY, fontweight="bold", loc="left", pad=14)
fig.text(0.005, 0.005,
          "Solid navy = active build/delivery period.  Hatched = ongoing maintenance once a workstream is established.",
          fontsize=7.3, color=MUTED)
plt.tight_layout(rect=[0, 0.02, 1, 1])
plt.savefig(f"{OUT}/diagram-1-roadmap-swimlane.png", facecolor=WHITE, bbox_inches="tight")
plt.close()
print("wrote diagram 1")

# ============================================================
# Diagram 2: governance / work-item workflow — simple linear flow + return loop
# ============================================================
fig, ax = plt.subplots(figsize=(12, 4.6), dpi=220)
ax.set_xlim(0, 100)
ax.set_ylim(0, 48)
ax.axis("off")

def box(x, y, w, h, text, fc=WHITE, ec=NAVY, tc=BLACK, fs=8.6, lw=1.6):
    b = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.6,rounding_size=3",
                        linewidth=lw, edgecolor=ec, facecolor=fc, zorder=3)
    ax.add_patch(b)
    ax.text(x + w/2, y + h/2, text, ha="center", va="center", fontsize=fs, color=tc,
            linespacing=1.3, zorder=4)
    return (x, y, w, h, x + w/2, y + h/2)

def flow_arrow(b1, b2, text=None):
    x1, y1, w1, h1, cx1, cy1 = b1
    x2, y2, w2, h2, cx2, cy2 = b2
    p1 = (x1 + w1, cy1)
    p2 = (x2, cy2)
    a = FancyArrowPatch(p1, p2, arrowstyle="-|>", mutation_scale=15, linewidth=1.6,
                         color=NAVY, shrinkA=1, shrinkB=1, zorder=2)
    ax.add_patch(a)
    if text:
        ax.text((p1[0]+p2[0])/2, cy1 + h1/2 + 1.6, text, ha="center", va="bottom",
                 fontsize=7.6, color=MUTED)

y0, h0 = 26, 16
b1 = box(0.5, y0, 15.5, h0, "Staff or team\nraises a need", fs=8.4)
b2 = box(18, y0, 17, h0, "One DSD Team\nintake: a bounded\nwork item, a named\ndecision owner", fs=8.0)
b3 = box(37, y0, 25, h0, "Routed by kind\n• content → Workstream 1\n• a decision → Executive\n  or DEIA Council\n• data → Workstream 4", fs=7.7, fc=PANEL)
b4 = box(64, y0, 17, h0, "Outcome recorded:\ndelivery, application\nand benefit kept\ndistinct", fs=7.9)
b5 = box(83, y0, 16.5, h0, "Monthly &\nquarterly reporting\n(aggregate only)", fs=8.0)

flow_arrow(b1, b2, "raised")
flow_arrow(b2, b3, "triaged")
flow_arrow(b3, b4, "resolved")
flow_arrow(b4, b5, "reported")

# return loop: box5 bottom -> down -> left -> up into box1 bottom
cx5, cx1 = b5[4], b1[4]
y_bottom = y0
y_return = 7
ax.plot([cx5, cx5], [y_bottom, y_return], color=NAVY, linewidth=1.4, zorder=2)
ax.plot([cx5, cx1], [y_return, y_return], color=NAVY, linewidth=1.4, zorder=2)
arrow_up = FancyArrowPatch((cx1, y_return), (cx1, y_bottom), arrowstyle="-|>",
                             mutation_scale=15, linewidth=1.4, color=NAVY, zorder=2)
ax.add_patch(arrow_up)
ax.text((cx5 + cx1) / 2, y_return - 2.6,
        "closes the loop — fed back into the content log, ASK, and the next release",
        ha="center", va="top", fontsize=7.8, color=MUTED)

ax.set_title("How a work item moves through the Program's governance",
             fontsize=12.5, color=NAVY, fontweight="bold", loc="left", x=0.0, y=0.98)
plt.tight_layout()
plt.savefig(f"{OUT}/diagram-2-governance-workflow.png", facecolor=WHITE, bbox_inches="tight")
plt.close()
print("wrote diagram 2")

# ============================================================
# Diagram 3: dependency map across the ten workstreams (layered)
# ============================================================
TIERS = [
 ["1"],
 ["2", "3"],
 ["10", "6", "5", "4"],
 ["7", "8", "9"],
]
LABELS = {
 "1": "Program\nmaintained",
 "2": "Division-wide\nlaunch",
 "3": "Governance\nseated",
 "10": "Team &\nAmplify",
 "6": "Learning &\nIDI",
 "5": "Vision &\ncomms",
 "4": "Data\nbaseline",
 "7": "Equity before\nthe decision",
 "8": "Community\nengagement",
 "9": "Legislative\ndimension",
}
EDGES = [
 ("1", "2"), ("1", "3"),
 ("2", "10"), ("3", "10"),
 ("3", "6"), ("3", "5"), ("3", "4"),
 ("5", "8"), ("4", "7"), ("3", "7"), ("5", "9"), ("7", "9"),
]

fig, ax = plt.subplots(figsize=(11.5, 6.2), dpi=220)
ax.axis("off")
positions = {}
tier_x = [8, 32, 58, 86]
box_w, box_h = 16, 10
for ti, tier in enumerate(TIERS):
    n = len(tier)
    total_h = n * (box_h + 6) - 6
    y_start = (58 - total_h) / 2 + total_h - box_h
    for i, node in enumerate(tier):
        y = y_start - i * (box_h + 6)
        positions[node] = (tier_x[ti], y)

for a, b in EDGES:
    xa, ya = positions[a]; xb, yb = positions[b]
    p1 = (xa + box_w/2, ya + box_h/2)
    p2 = (xb - box_w/2, yb + box_h/2)
    rad = 0.15 if ya >= yb else -0.15
    if abs(ya - yb) < 0.5:
        rad = 0.0
    arr = FancyArrowPatch(p1, p2, arrowstyle="-|>", mutation_scale=13, linewidth=1.3,
                           color=NAVY, alpha=0.75, connectionstyle=f"arc3,rad={rad}",
                           shrinkA=2, shrinkB=2, zorder=2)
    ax.add_patch(arr)

for node, (x, y) in positions.items():
    b = FancyBboxPatch((x - box_w/2, y), box_w, box_h, boxstyle="round,pad=0.5,rounding_size=3",
                        linewidth=1.6, edgecolor=NAVY, facecolor=WHITE, zorder=3)
    ax.add_patch(b)
    ax.text(x, y + box_h/2 + 1.6, node + ".", ha="center", va="bottom", fontsize=9,
            fontweight="bold", color=NAVY, zorder=4)
    ax.text(x, y + box_h/2 - 1.0, LABELS[node], ha="center", va="center", fontsize=7.6,
            color=BLACK, linespacing=1.2, zorder=4)

tier_names = ["Already built\nand ongoing", "Unlocks in\nYear 1", "Unlocked once\ngovernance seats",
              "Unlocked as data,\nvision & comms mature"]
for ti, name in enumerate(tier_names):
    ax.text(tier_x[ti], 62, name, ha="center", va="bottom", fontsize=8.2, color=MUTED, linespacing=1.2)

ax.set_xlim(-4, 100)
ax.set_ylim(-4, 70)
ax.set_title("What has to be true before what: workstream dependencies",
             fontsize=12.5, color=NAVY, fontweight="bold", loc="left", x=0.0, y=1.0)
plt.tight_layout()
plt.savefig(f"{OUT}/diagram-3-dependency-map.png", facecolor=WHITE, bbox_inches="tight")
plt.close()
print("wrote diagram 3")
