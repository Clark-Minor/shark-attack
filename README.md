# Shark Attack

A one-player game featuring an octopus and several sharks in a tank of moving water. The goal is to protect the octopus from 8 predatory sharks by moving around and inking them. You win the game after all of the sharks have been successfully inked. You lose if you get hit (eaten) by a shark. The sharks all swim at different speeds, so you better move quick!!!

## Directions

Go to https://clark-minor.github.io/shark-attack/ to play.

Keyboard input:
Press 's' to move the octopus foward,
'w' to move backward,
'a' to move left, and
'd' to move right.
Press the spacebar to ink.

## Member Contributions

Shelley Pi: Created the models for skybox, tank, shark, and water surface. Simulated water movement through phase changes with respect to time and through repeated updates of positions and normals by copying them to the graphics card at every frame. Implemented lighting for a more realistic water surface. Simulated caustics and ink through the use of gifs. Implemented HTML text canvas.

Clark Minor: Prototype octopus shape by creating a new class Half_Torus for each of the legs. Implement button controls for controlling the velocity of the octopus and random velocity for each shark. Help implement logic for collision detection between octopus, sharks, walls, and ink clouds.

Andrew Piro: Helped implemented logic for collision detection between octopus, sharks, walls, and ink clouds. Implemented logic for processing player input and applying the appropriate velocity to the octopus. Created the logic to process shark collisions with walls, and to bounce the sharks at a semi-random angle.

## Note:
Water caustics has no problem rendering the first frame, but loading the other frames require high processing power.
