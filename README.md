# Shark Attack

A one-player game featuring an octopus in an octo-shark tank of moving water. The goal is to protect the octopus from 8 predatory sharks by moving around and inking them. 

## Directions

Keyboard input:
Press 's' to move the octopus foward,
'w' to move backward,
'a' to move left, and
'd' to move right.
Press ' ' to ink.

## Member Contributions

Shelley Pi: Created the models for skybox, tank, shark, and water surface. Simulated water movement through phase changes with respect to time and through repeated updates of positions and normals by copying them to the graphics card at every frame. Implemented lighting for a more realistic water surface. Simulated caustics and ink through the use of gifs. Implemented HTML text canvas.

Clark Minor: Prototype octopus shape by creating a new class Half_Torus for each of the legs. Implement button controls for controlling the velocity of the octopus and random velocity for each shark. Help implement logic for collision detection between octopus, sharks, walls, and ink clouds.

Andrew Piro:

## Note:
Water caustics has no problem rendering the first frame, but loading the other frames require high processing power.
