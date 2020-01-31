# Bomberda: Game description

### Input levels

Each level is a uniform 2D grid. Each cell in the grid can be one of the following:

* Floor (symbol " " (space)): Can be traversed.
* Wall (symbol `#`): Cannot be traversed. Not destroyable.
* Fragile floor (symbol `x`): Can be traversed. If an actor moves over it (i.e. after an actor _leaves the tile_), collapses and becomes Collapsed Floor. Can also be destroyed with bombs (and then changes to Collapsed floor).
* Collapsed floor (symbol `X`): Cannot be traversed. Functions exactly like a wall.
* Box (symbol `$`): Cannot be traversed. Can be destroyed with bombs (and then changes to Floor).
* Player (symbol `@`): The actor which is controlled by the player.
* Enemy (symbol `E`): An "enemy" actor which reacts deterministically to the player's actions.
* Treasure (symbol `.`): The goal to be reached by the actor.

A level must always be completely surrounded by walls, i.e. there are no traversable cells which would lead outside the specified level.

In the level description, there must be **exactly one player** and **at most one enemy**. If there is an enemy, then the treasure can be omitted, in which case the treasure is _inside_ the enemy. If no enemy is specified, then there must be **exactly one treasure** in the level description.

Floor cells which contain an enemy, or the treasure, or a bomb (see below) are considered traversable just like any "empty" floor cell.

### Game mechanics

The game logic works in a turn-based way. **The game ends** when the player picks up the treasure. Until then, the game cycles through the following turns in the given order:

* **The player's turn.**  
    - If the player is at the same position as the treasure, he can pick it up and **the player wins** and **The game ends**.
    - If no other bomb exists in the current state of the game, then the player can _place a bomb_. This spawns a bomb at the player's current position with a counter value of 3. After placing the bomb it is still the player's turn.
    - The player must _move_ one cell in one of the four directions (up, down, left, or right). The player can only move onto traversable cells. Also, walking against a wall or a box or into collapsed floor (i.e. a _move_ action without actually changing the position) is **not** a valid turn. If the player leaves fragile floor with his turn, that fragile floor will become collapsed floor. After a valid move it is the enemy's turn.
* **The enemy's turn.** 
    - If there is no enemy on the map then we continue with the bomb's turn.
    - If the enemy is at the same position as the player, **the player loses** and **The game ends**. Otherwise:
    - The enemy will attempt to mirror the player's movement by walking a single cell into the opposite direction of the player's last move direction. If this movement is blocked by a non-traversable cell, then the enemy stands still. If the enemy moves into the player's position **the player loses**  and and **The game ends**. If the enemy leaves fragile floor with its turn, that fragile floor will become collapsed floor.
* **The bomb's turn.**
    - If there is no bomb on the map then we continue with the player's turn.
    - The counter of the bomb decreases by one. If the counter reaches zero due to this change, the bomb immediately explodes and is removed from the game.
The blast area of an exploding bomb includes the bomb's position and all four adjacent cells. It has the following effects (in any order):
        - If the player is in the blast area, **the player loses**.
        - If the enemy is in the blast area, the enemy is removed from the game. If there is no treasure on the game field, then the treasure spawns at the position of the removed enemy.
        - Boxes in the blast area are destroyed, changing to regular floor.
        - Fragile floor tiles in the blast area collapse, changing to collapsed floor.
