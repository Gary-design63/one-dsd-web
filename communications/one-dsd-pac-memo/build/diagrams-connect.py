import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patheffects as pe
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch, Circle, Rectangle

# Palette: DHS navy carries structure; the logo's green and a teal carry the other two
# parties and the upward flow, each dark enough for white text (all > 5:1).
NAVY="#003865"; NAVY_D="#002544"; GREEN="#3F7A0B"; TEAL="#145E6B"
INK="#111110"; MUTED="#3D3D3B"; LINE="#C9C9C4"; PANEL="#F2F3F1"; WHITE="#FFFFFF"
plt.rcParams["font.family"]="DejaVu Sans"; plt.rcParams["text.color"]=INK
OUT="/tmp/claude-0/-home-user-one-dhs-equity-resource/41be875d-a25e-5ef4-a520-759436e73a12/scratchpad/connect"
HALO=[pe.withStroke(linewidth=3.2, foreground=WHITE)]

def box(ax,x,y,w,h,title,body=None,band=NAVY,edge=None,lw=1.6,ts=10.0,bs=8.2,band_frac=0.34):
    """A white box with a solid title band across the top (white text on color), body below."""
    edge = edge or band
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle="round,pad=0.004,rounding_size=0.010",
        fc=WHITE,ec=edge,lw=lw,zorder=3))
    if body:
        bh=h*band_frac
        ax.add_patch(FancyBboxPatch((x,y+h-bh),w,bh,boxstyle="round,pad=0.004,rounding_size=0.010",
            fc=band,ec=band,lw=lw,zorder=4))
        ax.add_patch(Rectangle((x,y+h-bh),w,bh*0.5,fc=band,ec="none",zorder=4))  # square the band's bottom edge
        ax.text(x+w/2,y+h-bh/2,title,ha="center",va="center",fontsize=ts,fontweight="bold",color=WHITE,zorder=5)
        ax.text(x+w/2,y+(h-bh)/2,body,ha="center",va="center",fontsize=bs,color=INK,zorder=5,linespacing=1.55)
    else:
        ax.text(x+w/2,y+h/2,title,ha="center",va="center",fontsize=ts,fontweight="bold",color=band,zorder=5)

def arrow(ax,p1,p2,lw=1.8,color=NAVY,ls="-",rad=0.0):
    ax.add_patch(FancyArrowPatch(p1,p2,arrowstyle="-|>",mutation_scale=14,lw=lw,color=color,
        linestyle=ls,connectionstyle=f"arc3,rad={rad}",zorder=6,shrinkA=3,shrinkB=3))

# =====================================================================
# A. How the levels connect
# =====================================================================
fig,ax=plt.subplots(figsize=(11.0,7.4),dpi=220)
ax.set_xlim(0,1); ax.set_ylim(0,1); ax.axis("off")
LV=[
 (0.775,"DEPARTMENT  —  Minnesota DHS",
  "The North Star. Sets the course for the whole agency.\n"
  "DHS Equity Policy and Equity Analysis Toolkit  ·  One Minnesota Plan\n"
  "The Program follows the Department's mandate, its Equity Policy and the equity ecosystem it contemplates"),
 (0.565,"ADMINISTRATION  —  Aging and Disability Services",
  "Translates the Department's course into six equity goals for its divisions.\n"
  "Equity and Inclusion Implementation Plan  ·  Equity Director, Deqa Sayid"),
 (0.355,"DIVISION  —  Disability Services",
  "Decides how the six goals are met in this Division's own work.\n"
  "Four operating non-negotiables  ·  Heidi Hamilton, Leigh Ann Ahmad"),
 (0.145,"THE PROGRAM  —  One DSD People, Access and Culture",
  "The implementation layer — the only level a staff member actually opens.\n"
  "Courses · practice paths · community briefs · job aids · ASK · downloadable resources"),
]
H=0.155
for i,(y,t,b) in enumerate(LV):
    box(ax,0.075,y,0.85,H,t,b,band=(NAVY_D if i in (0,3) else NAVY),ts=11.0,bs=8.6,band_frac=0.36)
for y in [0.775,0.565,0.355]:
    arrow(ax,(0.34,y),(0.34,y-0.055),lw=2.3)
    arrow(ax,(0.66,y-0.055),(0.66,y),lw=1.7,ls=(0,(3,2.5)),color=GREEN)
ax.text(0.325,0.955,"AUTHORITY FLOWS DOWN",ha="right",va="center",fontsize=9.0,fontweight="bold",color=NAVY)
ax.text(0.675,0.955,"PRACTICE AND EVIDENCE FLOW UP",ha="left",va="center",fontsize=9.0,fontweight="bold",color=GREEN)
ax.text(0.5,0.062,
  "The Program stays in alignment with the Department's mandate and Equity Policy, working alongside the Administration within one DHS equity ecosystem.\n"
  "Its work is to make each level legible to the one below it, so a staff member can see how their own work connects upward.",
  ha="center",va="center",fontsize=8.7,color=MUTED,linespacing=1.6)
fig.savefig(f"{OUT}/diagram-a-how-the-levels-connect.png",bbox_inches="tight",facecolor=WHITE,pad_inches=0.16)
plt.close(fig)

# =====================================================================
# B. Venn — what is fixed, what is flexible   (equal aspect: real circles)
# =====================================================================
fig,ax=plt.subplots(figsize=(10.0,8.9),dpi=220)
ax.set_xlim(-1.70,1.70); ax.set_ylim(-1.98,1.62)
ax.set_aspect("equal"); ax.axis("off")
r=0.86; d=0.50
C=[(0.0,d),(-d*0.885,-d*0.52),(d*0.885,-d*0.52)]
FILL=[(NAVY,0.30),(GREEN,0.30),(TEAL,0.30)]
EDGE=[NAVY,GREEN,TEAL]
for (c,(fc,a),ec,solid) in zip(C,FILL,EDGE,[True,False,False]):
    ax.add_patch(Circle(c,r,fc=fc,ec="none",alpha=a,zorder=2))
    ax.add_patch(Circle(c,r,fc="none",ec=ec,lw=(3.0 if solid else 2.2),ls=("-" if solid else (0,(6,3.5))),zorder=6))

def label(x,y,title,sub,color,ts=10.6,ss=8.8):
    ax.text(x,y,title,ha="center",va="center",fontsize=ts,fontweight="bold",color=color,
            linespacing=1.45,zorder=8,path_effects=HALO)
    ax.text(x,y-0.27,sub,ha="center",va="center",fontsize=ss,style="italic",color=INK,
            linespacing=1.45,zorder=8,path_effects=HALO)

label(0.0, C[0][1]+0.44, "DHS EQUITY POLICY\nAND DEIA PRINCIPLES", "the only non-negotiable", NAVY)
label(C[1][0]-0.20, C[1][1]-0.36, "ADSA\nSIX EQUITY GOALS", "what must be achieved;\nhow is open", GREEN)
label(C[2][0]+0.20, C[2][1]-0.36, "DSD OPERATING\nNON-NEGOTIABLES", "set by the Division,\nfor the Division", TEAL)

cy=(C[0][1]+C[1][1]+C[2][1])/3.0
ax.add_patch(Circle((0.0,cy),0.275,fc=WHITE,ec=NAVY,lw=2.6,zorder=9))
ax.text(0.0,cy+0.085,"THE",ha="center",va="center",fontsize=8.4,fontweight="bold",color=NAVY,zorder=10)
ax.text(0.0,cy-0.005,"PROGRAM",ha="center",va="center",fontsize=9.6,fontweight="bold",color=NAVY,zorder=10)
ax.text(0.0,cy-0.115,"operates here",ha="center",va="center",fontsize=7.6,style="italic",color=INK,zorder=10)

ax.text(0.0,1.53,"What is fixed, and what is flexible",ha="center",va="center",
        fontsize=15.0,fontweight="bold",color=NAVY)
ax.text(0.0,-1.78,
  "One boundary is solid. The Program stays inside the DHS Equity Policy and the DEIA principles beneath it.\n"
  "Everything else is open: the six goals say what must be achieved, not how, and the Division's own\n"
  "non-negotiables are the Division's to set. The overlap is where the Program lives.",
  ha="center",va="center",fontsize=8.9,color=MUTED,linespacing=1.65)
fig.savefig(f"{OUT}/diagram-b-fixed-and-flexible.png",bbox_inches="tight",facecolor=WHITE,pad_inches=0.16)
plt.close(fig)

# =====================================================================
# C. Workflow — how the work moves
# =====================================================================
fig,ax=plt.subplots(figsize=(12.4,8.2),dpi=220)
ax.set_xlim(0,1); ax.set_ylim(0,1); ax.axis("off")

ax.add_patch(FancyBboxPatch((0.030,0.345),0.940,0.495,boxstyle="round,pad=0.006,rounding_size=0.012",
    fc=PANEL,ec=LINE,lw=1.2,zorder=1))
ax.text(0.052,0.806,"THE WORKING CYCLE  —  runs continuously",
        ha="left",va="center",fontsize=9.4,fontweight="bold",color=NAVY,zorder=4)

W=0.208; H=0.230; Y=0.540
STEPS=[
 (0.052,"1.  A question arises","in the middle of real work —\na policy change, a family,\na form, a conversation"),
 (0.288,"2.  Staff opens it","a course, a community brief,\na job aid, a practice path,\nor an answer from ASK"),
 (0.524,"3.  Staff does the work","the analysis, the engagement,\nthe decision, the service —\nwork that is theirs"),
 (0.760,"4.  Staff names the gap","a question with no answer,\na resource that did not fit\nthe work in front of them"),
]
for x,t,b in STEPS:
    box(ax,x,Y,W,H,t,b,band=NAVY,lw=1.6,ts=9.2,bs=8.0,band_frac=0.30)
for x in [0.052,0.288,0.524]:
    arrow(ax,(x+W,Y+H/2),(x+0.236,Y+H/2),lw=2.0)

box(ax,0.250,0.362,0.520,0.145,"5.  The consultant builds and updates",
    "new and revised resources  ·  a monthly release note  ·  a log of what was asked for\n"
    "available at all times, which frees the consultant's time for work groups",
    band=NAVY_D,lw=1.6,ts=9.2,bs=8.0,band_frac=0.40)
arrow(ax,(0.864,Y),(0.772,0.470),lw=2.0,rad=-0.30)
arrow(ax,(0.250,0.452),(0.156,Y),lw=2.0,rad=-0.30)

ax.text(0.5,0.306,"RESPONSIBILITY IS SHARED  —  IT SITS IN THREE PLACES AT ONCE",
        ha="center",va="center",fontsize=9.2,fontweight="bold",color=NAVY,zorder=4)
TRI=[
 (0.036,"LEADERSHIP","opening the Program to the Division\nchartering governance\nthe data baseline\nfunding a path for developing leaders\nwhere legislative work belongs",NAVY),
 (0.354,"STAFF","carrying the work itself\napplying what the resources supply\nsaying what is missing\nkeeping the consultant\ninformed of what is happening",GREEN),
 (0.672,"THE CONSULTANT","resources that are current and accessible\nhonest reporting, including\nwhat is not yet working\nrecommendations and guidance\nthat fit the work",TEAL),
]
for x,t,b,band in TRI:
    box(ax,x,0.040,0.292,0.240,t,b,band=band,lw=1.6,ts=9.6,bs=7.9,band_frac=0.24)

ax.text(0.5,0.960,"How the work moves",ha="center",va="center",fontsize=15.0,fontweight="bold",color=NAVY)
ax.text(0.5,0.898,"Nothing in this cycle is required of a staff member, and nothing in it is tracked against one.\nThe cycle runs continuously — that is the point of building it this way.",
        ha="center",va="center",fontsize=8.9,style="italic",color=MUTED,linespacing=1.6)

fig.savefig(f"{OUT}/diagram-c-how-the-work-moves.png",bbox_inches="tight",facecolor=WHITE,pad_inches=0.16)
plt.close(fig)
print("wrote 3 diagrams")
