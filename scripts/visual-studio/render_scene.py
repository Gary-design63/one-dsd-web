"""Trusted local studio scene builder. Request content is data, never Python."""
import bpy
import json
import math
import sys
from pathlib import Path
from mathutils import Vector

def arguments():
    supplied = sys.argv[sys.argv.index("--") + 1:]
    if len(supplied) != 3:
        raise ValueError("Expected brief, editable project and preview destinations.")
    brief_path, project_path, preview_path = [Path(value).resolve() for value in supplied]
    if not (brief_path.parent == project_path.parent == preview_path.parent):
        raise ValueError("Studio files must share one project directory.")
    if project_path.name != "scene.blend" or preview_path.name != "preview.png":
        raise ValueError("Unsupported output destinations.")
    if project_path.exists() or preview_path.exists():
        raise ValueError("An existing scene cannot be overwritten.")
    if brief_path.stat().st_size > 100_000:
        raise ValueError("The learning brief is too large.")
    brief = json.loads(brief_path.read_text(encoding="utf-8"))
    if brief.get("setting") not in ("meeting", "interview", "service"):
        raise ValueError("Unsupported setting.")
    return brief, project_path, preview_path

def material(name, color, roughness=0.55, metallic=0.0):
    result = bpy.data.materials.new(name)
    result.diffuse_color = (*color, 1)
    result.use_nodes = True
    shader = result.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    return result

def finish(obj, name, color):
    obj.name = name
    obj.data.materials.append(color)
    if obj.type == "MESH":
        for face in obj.data.polygons:
            face.use_smooth = True
    return obj

def sphere(name, location, scale, color):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, location=location)
    obj = bpy.context.object
    obj.scale = scale
    return finish(obj, name, color)

def cube(name, location, scale, color, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        edge = obj.modifiers.new("Soft edges", "BEVEL")
        edge.width = bevel
        edge.segments = 3
        obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return finish(obj, name, color)

def cylinder(name, location, radius, depth, color):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=depth, location=location)
    return finish(bpy.context.object, name, color)

def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()

def area(name, location, energy, size, color):
    bpy.ops.object.light_add(type="AREA", location=location)
    light = bpy.context.object
    light.name = name
    light.data.energy = energy
    light.data.shape = "DISK"
    light.data.size = size
    light.data.color = color
    aim(light, (0, 0, 0.8))

def participant(number, angle, radius, color, chair, table_height):
    x, y = math.cos(angle) * radius, math.sin(angle) * radius
    cylinder("Participant %s chair" % number, (x, y, 0.49), 0.38, 0.13, chair)
    cylinder("Participant %s chair base" % number, (x, y, 0.23), 0.07, 0.45, chair)
    sphere("Participant %s abstract torso" % number, (x, y, 1.02), (0.27, 0.24, 0.42), color)
    sphere("Participant %s abstract head" % number, (x, y, 1.61), (0.235, 0.235, 0.26), color)
    for side in (-1, 1):
        offset = Vector((-math.sin(angle), math.cos(angle), 0)) * side * 0.22
        start = Vector((x, y, 1.24)) + offset
        end = Vector((x * 0.62, y * 0.62, table_height + 0.1)) + offset
        arm = sphere("Participant %s arm %s" % (number, side), (start + end) / 2, (0.085, 0.085, (end - start).length / 2 + 0.03), color)
        arm.rotation_euler = (end - start).to_track_quat("Z", "Y").to_euler()
        sphere("Participant %s hand %s" % (number, side), end, (0.095, 0.095, 0.075), color)
    # Forms carry no facial, ethnic, religious or cultural attributes.

def main():
    brief, project_path, preview_path = arguments()
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    cream = material("Warm plaster", (0.79, 0.75, 0.67))
    floor = material("Sandstone", (0.65, 0.59, 0.48))
    wood = material("Pale oak", (0.58, 0.36, 0.18))
    table = material("Ivory work surface", (0.86, 0.80, 0.68))
    metal = material("Graphite", (0.065, 0.085, 0.09), 0.35, 0.2)
    teal = material("Teal participant", (0.05, 0.29, 0.30))
    plum = material("Plum participant", (0.31, 0.15, 0.25))
    gold = material("Ochre participant", (0.67, 0.37, 0.09))
    paper = material("Paper", (0.95, 0.91, 0.81))
    green = material("Sage", (0.27, 0.37, 0.25))
    cube("Studio floor", (0, 0, -0.11), (200, 200, 0.20), floor)
    cube("Quiet background wall", (0, 3.5, 1.8), (12, 0.18, 4), cream, 0.03)
    cube("Wall inset", (-1.6, 3.35, 1.9), (2.0, 0.12, 2.3), wood, 0.08)
    for x in (-2.25, -1.92, -1.59, -1.26, -0.93):
        cube("Oak acoustic detail", (x, 3.24, 1.9), (0.045, 0.06, 2.1), cream, 0.01)
    cylinder("Round woven rug", (0, 0, 0.012), 2.45, 0.024, cream)
    setting = brief["setting"]
    height = 0.96
    if setting == "service":
        cube("Accessible service conversation table", (0, 0.12, height), (2.5, 1.5, 0.14), table, 0.16)
        cube("Open service table support", (0, 0.12, height / 2), (0.4, 0.7, height), wood, 0.06)
        poses = [(-2.6, 1.65), (-0.45, 1.65), (1.6, 1.6)]
    elif setting == "interview":
        cube("Interview table", (0, 0, height), (2.1, 1.55, 0.14), table, 0.16)
        cylinder("Interview table support", (0, 0, height / 2), 0.18, height, wood)
        poses = [(-2.7, 1.58), (-0.5, 1.58), (1.7, 1.6)]
    else:
        cylinder("Round shared discussion table", (0, 0, height), 1.02, 0.15, table)
        cylinder("Round table support", (0, 0, height / 2), 0.23, height, wood)
        poses = [(-2.6, 1.5), (-0.45, 1.5), (1.6, 1.5)]
    for number, ((angle, radius), color) in enumerate(zip(poses, [teal, gold, plum]), start=1):
        participant(number, angle, radius, color, metal, height)
    for x, y, angle in [(-0.44, -0.25, -0.1), (0.39, -0.18, 0.2), (0.05, 0.45, 0.1)]:
        obj = cube("Open learning notes", (x, y, height + 0.094), (0.34, 0.26, 0.013), paper, 0.01)
        obj.rotation_euler.z = angle
        cube("Pencil", (x + 0.14, y, height + 0.11), (0.012, 0.21, 0.012), wood, 0.004)
    cylinder("Plant pot", (2.3, 2.0, 0.30), 0.31, 0.6, wood)
    for index in range(7):
        angle = index * 2.4
        obj = sphere("Plant leaf", (2.3 + math.cos(angle) * 0.22, 2 + math.sin(angle) * 0.22, 0.85 + (index % 3) * 0.18), (0.10, 0.08, 0.45), green)
        obj.rotation_euler = (0.45 * math.cos(angle), 0.45 * math.sin(angle), angle)
    # The authored learning content stays editable, with no code evaluation.
    record = bpy.data.texts.new("Learning brief.json")
    record.write(json.dumps(brief, indent=2, ensure_ascii=False))
    instructions = bpy.data.texts.new("Studio notes.txt")
    instructions.write("Illustrative learning scene with three abstract participants.\n"
        "Colors identify figures only; they do not imply cultural traits.\n"
        "Edit the scene in Blender. Dialogue is in Learning brief.json.\n"
        "The preview is a still image, not a completed animation or video.\n")
    scene["studio_title"] = brief["title"]
    scene["learning_objective"] = brief["learningObjective"]
    scene["setting"] = setting
    bpy.ops.object.camera_add(location=(6.4, -8.4, 6.3))
    camera = bpy.context.object
    camera.name = "Learning scene camera"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 7.4
    aim(camera, (0, 0.3, 0.8))
    scene.camera = camera
    area("Large warm key", (-3, -4, 7), 850, 5.0, (1.0, 0.86, 0.69))
    area("Soft daylight fill", (4, 1, 5), 650, 4.0, (0.72, 0.85, 1.0))
    area("Background glow", (-1, 3, 5), 450, 3.0, (1.0, 0.94, 0.84))
    scene.world.use_nodes = True
    scene.world.node_tree.nodes["Background"].inputs[0].default_value = (0.45, 0.52, 0.6, 1)
    scene.world.node_tree.nodes["Background"].inputs[1].default_value = 0.35
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 12
    scene.cycles.use_denoising = True
    scene.render.threads_mode = "FIXED"
    scene.render.threads = 2
    scene.render.resolution_x = 640
    scene.render.resolution_y = 360
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(preview_path)
    scene.render.film_transparent = False
    bpy.ops.wm.save_as_mainfile(filepath=str(project_path), compress=False)
    bpy.ops.render.render(write_still=True)
    print("STUDIO_RENDER_COMPLETE")

if __name__ == "__main__":
    main()
