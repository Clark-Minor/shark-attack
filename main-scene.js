// window.Cube = window.classes.Cube =
// class Cube extends Shape    // A cube inserts six square strips into its arrays.
// { constructor()
//     { super( "positions", "normals", "texture_coords" );
//       for( var i = 0; i < 3; i++ )
//         for( var j = 0; j < 2; j++ )
//         { var square_transform = Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) )
//                          .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
//                          .times( Mat4.translation([ 0, 0, 1 ]) );
//           Square.insert_transformed_copy_into( this, [], square_transform );
//         }
//     }
// }


//SURFACE OF WATER//
window.Water = window.classes.Water =
class Water extends Shape
{ constructor(rows, columns, width, length, heightmap)
     {
       super( "positions", "normals" );
       this.positions = [];
       this.normals = [];
       this.indices = [];

       //basically creates a matrix[r][c] that stores the positions of vertices,
       //r*c = # of vertices over the span of length and width
       for(var i = 0; i < rows; i++)
       {
          let x = i * width / (rows-1);

          for(var j = 0; j < columns; j++)
          {
            let y = j * length / (columns-1);
            this.positions.push( Vec.of(x, y, heightmap[i][j])); //random z vertex so surface of water not so uniform waves
            this.normals.push(Vec.of(0, 0, 1));
          }
        }

        //drawing triangles with the vertices(positions) we got above
        for(var i=0; i < rows - 1; i++)
        {
            if(i % 2 == 0)
            for(var x = i * columns; x < (i+1) * columns - 1; x++)
            {
                  this.indices.push(x, x+1, x+columns, x+columns, x+1, x+columns+1);
            }

            else
            for(var x = (i+1) * columns - 2; x >= i * columns; x--)
            {
                  this.indices.push(x, x+1, x+columns+1, x, x+columns+1, x+columns);
            }
        }

        //randomize z coordinate of water for every vertex we have
        function random_height(min, max)
        {
          if(i > 0 && i < rows-1 && j > 0 && j < columns-1)
            return Math.random() * (max - min) + min;
          else
            return 0;
        }

     }//end of constructor

     send_water(gl)
     {
         this.copy_onto_graphics_card(gl, ["positions", "normals"], true);
     }


}



window.Body_Of_Water = window.classes.Body_Of_Water =
class Body_Of_Water extends Shape
{
    constructor()
      { super( "positions", "normals" ); // Name the values we'll define per each vertex.  They'll have positions and normals.

        // First, specify the vertex positions -- just a bunch of points that exist at the corners of an imaginary cube.
        this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
                                          [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
                                          [-1,-1,1],  [1,-1,1],  [-1,1,1],  [1,1,1], [1,-1,-1], [-1,-1,-1], [1,1,-1], [-1,1,-1] ) );
        // Supply vectors that point away from eace face of the cube.  They should match up with the points in the above list
        // Normal vectors are needed so the graphics engine can know if the shape is pointed at light or not, and color it accordingly.
        this.normals.push(   ...Vec.cast( [0,-1,0], [0,-1,0], [0,-1,0], [0,-1,0], [0,1,0], [0,1,0], [0,1,0], [0,1,0], [-1,0,0], [-1,0,0],
                                          [-1,0,0], [-1,0,0], [1,0,0],  [1,0,0],  [1,0,0], [1,0,0], [0,0,1], [0,0,1], [0,0,1],   [0,0,1],
                                          [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1] ) );

                 // Those two lists, positions and normals, fully describe the "vertices".  What's the "i"th vertex?  Simply the combined
                 // data you get if you look up index "i" of both lists above -- a position and a normal vector, together.  Now let's
                 // tell it how to connect vertex entries into triangles.  Every three indices in this list makes one triangle:
        this.indices.push( 0, 1, 2, 1, 3, 2,     //front
                           4, 5, 6, 5, 7, 6,    //back
                           8, 9, 10, 9, 11, 10,  //left
                           12, 13, 14, 13, 15, 14,  //right
                           /*16, 17, 18, 17, 19, 18,*/ //bottom                           //without top part / "lid"
                           /*20, 21, 22, 21, 23, 22*/);  //top
        // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
      }
}

window.Edge_Of_Tank = window.classes.Edge_Of_Tank =
class Edge_Of_Tank extends Shape                 // Here's a complete, working example of a Shape subclass.  It is a blueprint for a cube.
  { constructor()
      { super( "positions", "normals" ); // Name the values we'll define per each vertex.  They'll have positions and normals.

        // First, specify the vertex positions -- just a bunch of points that exist at the corners of an imaginary cube.
        this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
                                          [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
                                          [-1,-1,1],  [1,-1,1],  [-1,1,1],  [1,1,1], [1,-1,-1], [-1,-1,-1], [1,1,-1], [-1,1,-1] ) );
        // Supply vectors that point away from eace face of the cube.  They should match up with the points in the above list
        // Normal vectors are needed so the graphics engine can know if the shape is pointed at light or not, and color it accordingly.
        this.normals.push(   ...Vec.cast( [0,-1,0], [0,-1,0], [0,-1,0], [0,-1,0], [0,1,0], [0,1,0], [0,1,0], [0,1,0], [-1,0,0], [-1,0,0],
                                          [-1,0,0], [-1,0,0], [1,0,0],  [1,0,0],  [1,0,0], [1,0,0], [0,0,1], [0,0,1], [0,0,1],   [0,0,1],
                                          [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1] ) );

                 // Those two lists, positions and normals, fully describe the "vertices".  What's the "i"th vertex?  Simply the combined
                 // data you get if you look up index "i" of both lists above -- a position and a normal vector, together.  Now let's
                 // tell it how to connect vertex entries into triangles.  Every three indices in this list makes one triangle:
        this.indices.push( 8, 9, 10, 9, 11, 10, 12, 13,
                          14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22 );
        // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
      }
  }

window.Octopus = window.classes.Octopus =
class Octopus extends Shape
{ constructor()
    { super( "positions", "normals", "texture_coords" );
      var head_t = Mat4.identity().times(Mat4.scale([3,3,3]))
      var leg_1_t = Mat4.identity().times(Mat4.translation(Vec.of(-2,0,-1.5)))
      leg_1_t = leg_1_t.times(Mat4.rotation(Math.PI/2,Vec.of(1,0,0)))
      var leg_2_t = leg_1_t.times(Mat4.translation(Vec.of(Math.PI/4,0,1.5)))
      leg_2_t = leg_2_t.times(Mat4.rotation(Math.PI/4,Vec.of(0,1,0)))
      var leg_3_t = leg_2_t.times(Mat4.translation(Vec.of(Math.PI/4,0,1.5)))
      leg_3_t = leg_3_t.times(Mat4.rotation(Math.PI/4,Vec.of(0,1,0)))
      var leg_4_t = leg_3_t.times(Mat4.translation(Vec.of(Math.PI/4,0,1.5)))
      leg_4_t = leg_4_t.times(Mat4.rotation(Math.PI/4,Vec.of(0,1,0)))
      var leg_5_t = leg_4_t.times(Mat4.translation(Vec.of(Math.PI/4,0,1.5)))
      leg_5_t = leg_5_t.times(Mat4.rotation(Math.PI/4,Vec.of(0,1,0)))
      var leg_6_t = leg_5_t.times(Mat4.translation(Vec.of(Math.PI/4,0,1.5)))
      leg_6_t = leg_6_t.times(Mat4.rotation(Math.PI/4,Vec.of(0,1,0)))
      var leg_7_t = leg_6_t.times(Mat4.translation(Vec.of(Math.PI/4,0,1.5)))
      leg_7_t = leg_7_t.times(Mat4.rotation(Math.PI/4,Vec.of(0,1,0)))
      var leg_8_t = leg_7_t.times(Mat4.translation(Vec.of(Math.PI/4,0,1.5)))
      leg_8_t = leg_8_t.times(Mat4.rotation(Math.PI/4,Vec.of(0,1,0)))

      Subdivision_Sphere.insert_transformed_copy_into(this, [3], head_t)
      //Subdivision_Sphere.insert_transformed_copy_into(this, [2], eye_1_t)
      //Subdivision_Sphere.insert_transformed_copy_into(this, [2], eye_2_t)
      Half_Torus.insert_transformed_copy_into(this, [15,15], leg_1_t)
      Half_Torus.insert_transformed_copy_into(this, [15,15], leg_2_t)
      Half_Torus.insert_transformed_copy_into(this, [15,15], leg_3_t)
      Half_Torus.insert_transformed_copy_into(this, [15,15], leg_4_t)
      Half_Torus.insert_transformed_copy_into(this, [15,15], leg_5_t)
      Half_Torus.insert_transformed_copy_into(this, [15,15], leg_6_t)
      Half_Torus.insert_transformed_copy_into(this, [15,15], leg_7_t)
      Half_Torus.insert_transformed_copy_into(this, [15,15], leg_8_t)

//       var tip_1_t = Mat4.identity().times(Mat4.translation(Vec.of(5,0,-1))).times(Mat4.rotation(Math.PI/4, Vec.of(0,1,0)))
//       Cone_Tip.insert_transformed_copy_into(this, [15,15], tip_1_t)

    }
}

window.Octopus_Eyes = window.classes.Octopus_Eyes =
class Octopus_Eyes extends Shape
{
  constructor()                 // having their own 3D position, normal vector, and texture-space coordinate.
   { super( "positions", "normals", "texture_coords" );
     var eye_1_t = Mat4.identity().times(Mat4.translation(Vec.of(3,0,1))).times(Mat4.scale([.7,.7,.7]));
     var eye_2_t = eye_1_t.times(Mat4.translation(Vec.of(0,2,0)));

     Subdivision_Sphere.insert_transformed_copy_into(this, [2], eye_1_t);
     Subdivision_Sphere.insert_transformed_copy_into(this, [2], eye_2_t);


   }
}

window.Octopus_Pupil = window.classes.Octopus_Pupil =
class Octopus_Pupil extends Shape
{
  constructor()                 // having their own 3D position, normal vector, and texture-space coordinate.
   { super( "positions", "normals", "texture_coords" );
     var eye_1_t = Mat4.identity().times(Mat4.translation(Vec.of(3.5,.1,1))).times(Mat4.scale([2,1.7,3]));
     var eye_2_t = eye_1_t.times(Mat4.translation(Vec.of(0,.8,0)));

     Cube.insert_transformed_copy_into(this, [], eye_1_t);
     Cube.insert_transformed_copy_into(this, [], eye_2_t);


   }
}

window.Shark = window.classes.Shark =
class Shark extends Shape
{
  constructor()
      { super("positions", "normals", "texture_coords");
            var body_t = Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([3,1,2]))
            var head_t = Mat4.identity().times(Mat4.translation([3.2,0,0])).times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0))).times(Mat4.scale([1,1.1,1]))
            var bottom_t = Mat4.identity().times(Mat4.translation([-3,0,0])).times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0))).times(Mat4.scale([1,1.1,1]))
            var tail_t = Mat4.identity().times(Mat4.translation([-3,0,0])).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([1.5,1.5,1.5]))
            var fin_t = Mat4.identity().times(Mat4.translation([0,0,0.3])).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([2.2,2.2,2.2]))
            Rounded_Capped_Cylinder.insert_transformed_copy_into(this, [15,15], body_t);
            Rounded_Closed_Cone.insert_transformed_copy_into(this, [15,15], head_t);
            Rounded_Closed_Cone.insert_transformed_copy_into(this, [15,15], bottom_t);
            Triangle2.insert_transformed_copy_into(this, [], tail_t);
            Triangle.insert_transformed_copy_into(this, [], fin_t);
      }
}











window.Project_Scene = window.classes.Project_Scene =
class Project_Scene extends Scene_Component
  { constructor( context, control_box, gl, text_canvas )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        /*if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell(), text_canvas ) );*/

        //context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );
        context.globals.graphics_state.camera_transform = Mat4.translation([ 0,0,-50 ])    //forward backward
                                                    .times(Mat4.translation([ 0,-25,0 ]))  //up down, -25
                                                    .times(Mat4.translation([ -19,0,0 ]))  //left right,-20
                                                    .times(Mat4.rotation(-1.2, Vec.of(1,0,0)))  //angle up down
                                                    .times(Mat4.rotation(Math.PI/5, Vec.of(0,0,1)))  //angle sides
                                                    //.times(Mat4.rotation(Math.PI/4, Vec.of(0,1,0)));

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        //initially for water
        this.rows = 70;
        this.columns = 70;
        this.width = 95;  //x
        this.length = 70; //y
        this.height = 20; //z
        this.flow_height = [];
        this.time = 0;
        this.gl = gl;

        //for text on display
        this.textcanvas = text_canvas.getContext("2d");
        this.isGameOver = false;
        this.minutes = 0;
        this.seconds = 0;
        this.timer = setTimeout( () => {this.addTime();}, 1000 );  //adds time after 1s
        setTimeout( () => {	this.draw_time("#595751");
					        this.draw_kills("#595751"); }, 900 );

	    this.shark_kills = 0;
        this.number_of_inks = 0;
        this.octo_sinking = false;

        //OCTOPUS location
        this.octopus_t = Mat4.identity().times(Mat4.translation(Vec.of(this.width/2,this.length/2,5))).times(Mat4.rotation(-Math.PI/2, Vec.of(0,0,1)));
        this.go_forward = false;
        this.go_backward = false;
        this.go_left = false;
        this.go_right = false;
        this.octo_velocity = Vec.of(0,0,0);



        //SHARKs location
        this.shark_t = [Mat4.identity().times(Mat4.translation([5,5,1.25])),
        Mat4.identity().times(Mat4.translation([this.width-5,this.length-5,1.25])),
        Mat4.identity().times(Mat4.translation([this.width-5,5,1.25])),
        Mat4.identity().times(Mat4.translation([5,this.length-5,1.25])),
        Mat4.identity().times(Mat4.translation([5,5,1.25])).times(Mat4.rotation(Math.PI/4,Vec.of(0,0,1))),
        Mat4.identity().times(Mat4.translation([this.width-5,this.length-5,1.25])).times(Mat4.rotation(Math.PI/4,Vec.of(0,0,1))),
        Mat4.identity().times(Mat4.translation([this.width-5,5,1.25])).times(Mat4.rotation(Math.PI/4,Vec.of(0,0,1))),
        Mat4.identity().times(Mat4.translation([5,this.length-5,1.25])).times(Mat4.rotation(Math.PI/4,Vec.of(0,0,1)))
        ];
        this.shark_bounce = [0,0,0,0,0,0,0,0,0];
        this.shark_velocity = [Vec.of(.4, 0, 0),Vec.of(.7, 0, 0),Vec.of(.3, 0, 0),Vec.of(.3, 0, 0),
                                Vec.of(.5, 0, 0),Vec.of(.5, 0, 0),Vec.of(.7, 0, 0),Vec.of(.5, 0, 0)]
        this.is_sunk = [false,false,false,false,false,false,false,false]

        //random z for water (peaks and troughs)
        for(var i = 0; i < this.rows; i++)
        {
          let rowArr = [];
          for(var j = 0; j < this.columns; j++)
          {
                rowArr.push(3*Math.random());  //height varies from 0 to 3
          }
          this.flow_height.push(rowArr);
        }

        //for caustics//
        this.caustic_counter = 0;
        this.caustic_update = true;
        this.gif_ready = false;
        setTimeout( () => { this.gif_ready = true; }, 5000 );
        for(var i = 0; i < 100; i++)
        {
            var img = new Image();
            img.src = "assets/Caustic/target-" + i + ".png";
        }

        //for smoke//
        this.smoke_counter = 0;
        this.smoke_update = false;
        this.gif_ready_smoke = false;
        setTimeout( () => { this.gif_ready_smoke = true; }, 200000 );
        for(var i = 0; i < 14; i++)
        {
            var img = new Image();
            img.src = "assets/Smoke/" + i + ".png";
        }
        //INK location
        this.ink_t = this.octopus_t.times(Mat4.scale([3,3,0])).times(Mat4.translation([3,-500,-this.height]));
        this.do_draw_ink = false;

        //bottom left game Instructions

        this.isDrawInstr = true;


        this.shapes = {  axis: new Axis_Arrows(),

                         water: new ( Water.prototype.make_flat_shaded_version() )(this.rows, this.columns, this.width, this.length, this.flow_height),
                         caustic: new Square(),
                         tank: new Body_Of_Water(),
                         tankedge: new Edge_Of_Tank(),

                         octopus: new Octopus(),
                         eyes: new Octopus_Eyes(),
                         pupil: new Octopus_Pupil(),
                         smoke: new Square(),

                         shark: new Shark(),

                         wall: new Square(),
                         floor: new Square(),
                         hitbox: new Square()

                      }

        this.context = context;
        this.submit_shapes( this.context, this.shapes );

        // Make some Material objects available to you:
        this.materials =
          { axis_material:     context.get_instance( Phong_Shader ).material(Color.of(1,1,1,1)),

            water_material:     context.get_instance( Phong_Shader ).material(Color.of( /*36/255, 171/255, 255/255,*/ /*56/255, 213/255, 252/255,*/0,149/255,255/255, 0.6 ),
            {
              ambient: 1,  //0.6
              diffusivity: 0.5,  //0.1
              specular: 0,  //0.5
              smoothness: 80   //fuck is the difference???
            }),

            edge_material: context.get_instance(Phong_Shader).material(Color.of(158/255,215/255,1,1), {ambient: 1}),

            wall_texture: context.get_instance( Phong_Shader ).material(Color.of(0, 0, 0, 1), //opaque black
            {
                ambient: 1,
                texture: context.get_instance("assets/wall2.png", true) //true = trilinear filtering
            }),

            floor_texture: context.get_instance( Phong_Shader ).material(Color.of(0, 0, 0, 1), //opaque black
            {
                ambient: 1,
                texture: context.get_instance("assets/sand.png", true) //true = trilinear filtering
            }),

            octopus_skin: context.get_instance( Phong_Shader ).material(Color.of(/*204/255,0,170/255*/ 235/255,84/255,150/255,1),
            {
                ambient: 0.8,
                //diffusivity: 0.5,
                //specular: 0.5,
            }),

            eye_material: context.get_instance( Phong_Shader ).material(Color.of(1,1,1,1), {ambient: 0.8}),

            pupil_material: context.get_instance( Phong_Shader ).material(Color.of(0,0,0,1), {ambient: 0.8}),

            caustic_material: context.get_instance( Phong_Shader ).material(Color.of( 0,0,0,1 ),
            {
                  ambient: 0.4,
                  texture: context.get_instance("assets/Caustic/target-0.png",true)
            }),

            shark_material: context.get_instance( Phong_Shader ).material(Color.of(158/255,154/255,144/255,1),
            {
                  ambient: 0.5,
            }),

            smoke_material: context.get_instance(Phong_Shader).material(Color.of(1,1,1,1),
            {
                  ambient: 1,
                  texture: context.get_instance("assets/Smoke/0.png",true)
            }),

          }

        //(position, color, size)
        this.lights = [ //new Light( Vec.of( this.width/2,this.length/2,0,1 ), Color.of( 1, 0.4, 1, 1 ), 100000 ),
                        //new Light( Vec.of( this.width/2,this.length/2,0,-1 ), Color.of( 1, 0.4, 1, 1 ), 1000 ),
                        new Light( Vec.of( 70,95,10,1 ), Color.of( 0, 1, 1, 1 ), 100000 )
                        ];


      } //end of constructor

    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      {
        this.key_triggered_button( "Go Forward", [ "s" ], () => this.go_forward = true, '#'+Math.random().toString(9).slice(-6), () => this.go_forward = false);
        this.key_triggered_button( "Go Backward", [ "w" ],() => this.go_backward = true, '#'+Math.random().toString(9).slice(-6), () => this.go_backward = false);
        this.key_triggered_button( "Go Left", [ "a" ], () => this.go_left = true, '#'+Math.random().toString(9).slice(-6), () => this.go_left = false);
        this.key_triggered_button( "Go Right", [ "d" ],() => this.go_right = true, '#'+Math.random().toString(9).slice(-6), () => this.go_right = false);
        this.new_line();
        this.key_triggered_button("Ink", [" "], () =>  this.ink_t = this.octopus_t.times(Mat4.scale([3,3,0])).times(Mat4.translation([3,0,5])), '#'+Math.random().toString(9).slice(-6) , () => this.number_of_inks++);
      }

    update_scene(graphics_state, dt)
    {
      //DRAW OCTOPUS with keyboard input for movement//

      if (this.go_forward)
      {
        this.octo_velocity[0] = .25;
      }
      else if (this.go_backward)
      {
        this.octo_velocity[0] = -.25;
      }
      else
      {
        this.octo_velocity[0] = 0;
      }

      if(this.go_right)
      {
        this.octo_velocity[1] = .25;
      }
      else if (this.go_left)
      {
        this.octo_velocity[1] = -.25;
      }
      else
      {
        this.octo_velocity[1] = 0;
      }

      var octopus_t = Mat4.identity().times(Mat4.translation(Vec.of(this.width/2,this.length/2,5))).times(Mat4.rotation(-2*Math.PI/3, Vec.of(0,0,1)));

      //COLLISION DETECTION for boundaries of water
      //console.log(this.octopus_t[0][3]);
        if(this.octopus_t[1][3] > this.length - 5.5)
        {
          this.octopus_t[1][3] = this.length - 5.5;
          this.octo_velocity[0] = 0;
        }
        if(this.octopus_t[1][3] < 5.5)
        {
          this.octopus_t[1][3] = 5.5
          this.octo_velocity[0] = 0;
        }
        if(this.octopus_t[0][3] > this.width - 5.5)
        {
          this.octopus_t[0][3] = this.width - 5.5;
          this.octo_velocity[1] = 0;
        }
        if(this.octopus_t[0][3] < 5.5)
        {
          this.octopus_t[0][3] = 5.5;
          this.octo_velocity[1] = 0;
        }

      if(this.octopus_t[2][3] >= -this.height + 4.5)
      {
        this.octopus_t =
        this.octopus_t.times(Mat4.translation(this.octo_velocity));
      }


      this.draw_octopus(graphics_state, this.octopus_t);

      //DRAW SHARK freely moving with random component (bounce angle against boundaries of water)//
      for(var i = 0; i < this.shark_t.length; i++)
      {
        //if(is_sunk[i])
          //break;
        //console.log(shark);
        if(this.shark_t[i][2][3] >= -this.height + 2.5)
        this.shark_t[i] =
        this.shark_t[i].times(Mat4.translation(this.shark_velocity[i]));

        var bounce_angle = Math.random() * 1.5 - .75;
        //console.log(bounce_angle + Math.PI);
        if(this.shark_t[i][0][3] > this.width - 5)
        {
          this.shark_t[i][0][3] = this.width - 5;
          this.shark_t[i] = this.shark_t[i].times(Mat4.rotation(Math.PI + bounce_angle,Vec.of(0,0,1)))
          this.shark_bounce[i] = bounce_angle + Math.PI;
        }
        if(this.shark_t[i][0][3] < 5)
        {
          this.shark_t[i][0][3] = 5;
          this.shark_t[i]= this.shark_t[i].times(Mat4.rotation(Math.PI + bounce_angle,Vec.of(0,0,1)))
          this.shark_bounce[i] = bounce_angle + Math.PI;
        }
        if(this.shark_t[i][1][3] > this.length - 5)
        {
          this.shark_t[i][1][3] = this.length - 5;
          this.shark_t[i] = this.shark_t[i].times(Mat4.rotation(Math.PI + bounce_angle,Vec.of(0,0,1)))
          this.shark_bounce[i] = bounce_angle + Math.PI;
        }
        if(this.shark_t[i][1][3] < 5)
        {
          this.shark_t[i][1][3] = 5;
          this.shark_t[i] = this.shark_t[i].times(Mat4.rotation(Math.PI + bounce_angle,Vec.of(0,0,1)))
          this.shark_bounce[i] = bounce_angle + Math.PI;
        }
        this.draw_shark(graphics_state, this.shark_t[i]);
        //console.log(this.octopus_t)

      }
    }

    collision_detection(graphics_state, shark)
    {
        var octo_circ = {x:this.octopus_t[0][3], y:this.octopus_t[1][3], radius: 5}
        var shark_circ = {x:shark[0], y:shark[1], radius: 2}

        //console.log(shark)
        //this.shapes.hitbox.draw(graphics_state, this.octopus_t.times(Mat4.scale(Vec.of(10,10,0))),
         //this.materials.shark_material);
        // this.shapes.hitbox.draw(graphics_state, Mat4.identity().times(Mat4.translation(Vec.of(95,0,0))).times(Mat4.scale(Vec.of(10,10,0))),this.materials.shark_material);

        // this.shapes.hitbox.draw(graphics_state, Mat4.identity().times(this.shark_t[0]).times(Mat4.scale(Vec.of(2,2,0))), this.materials.octopus_skin)
        //console.log(this.shark_bounce[1])
        //console.log(this.shark)
        var rotate_head = Mat4.rotation(this.shark_bounce[1],Vec.of(0,0,1))
        var translate_head = Mat4.translation(Vec.of(this.shark_t[1][0][0]*4,this.shark_t[1][0][1]*4,0))
        var shark_mat = Mat4.translation(Vec.of(this.shark_t[1][0][3],this.shark_t[1][1][3],0));
      //  this.shapes.hitbox.draw(graphics_state, Mat4.identity().times(this.shark_t[1]).times(Mat4.scale(Vec.of(2,2,0))), this.materials.octopus_skin)

        var dx = octo_circ.x - shark_circ.x;
        var dy = octo_circ.y - shark_circ.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < octo_circ.radius + shark_circ.radius){

                //this.graphics_state.animate = 0
                //this.isGameOver = !this.isGameOver;
                this.octo_velocity = Vec.of(0,0,-.25)
                this.draw_gameOver();
                clearTimeout(this.timer);
            }
    }

    collision_detection_ink(graphics_state, shark, shark_num){
      var shark_circ = {x:shark[0], y:shark[1], radius: 2}
      var ink_circ = {x:this.ink_t[0][3], y:this.ink_t[1][3], radius: 3}

      var dx = ink_circ.x - shark_circ.x;
      var dy = ink_circ.y - shark_circ.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ink_circ.radius + shark_circ.radius){

              //this.graphics_state.animate = 0
              //this.isGameOver = !this.isGameOver;
              this.is_sunk[shark_num] = true;
              this.shark_velocity[shark_num] = Vec.of(0,0,-0.25);
              this.shark_kills ++;
              if(this.shark_kills >= this.shark_t.length)
              {
                this.draw_gameOver();
              }
          }
    }

    draw_octopus(graphics_state, transform)
    {

        this.shapes.octopus.draw(graphics_state, transform, this.materials.octopus_skin);
        this.shapes.eyes.draw(graphics_state, transform, this.materials.eye_material);
        this.shapes.pupil.draw(graphics_state, transform, this.materials.pupil_material);

    }

    draw_ink(graphics_state, transform)
    {
        /*if (this.smoke_counter >= 13)
            this.smoke_counter = 0;
    */
        if(this.smoke_update)
        {
            //console.log("a")
            this.smoke_counter += 1;
            this.smoke_counter = this.smoke_counter%13;
            this.smoke_update = false;
        }
        else
            //console.log("b")
            this.smoke_update = true;



         var smoke_str = "assets/Smoke/" + this.smoke_counter.toString() +  ".png";

         var smoke_transform = transform
         //Mat4.identity().times(Mat4.translation([0,0,10])).times(Mat4.scale([3,3,0]))
         if(!this.gif_ready_smoke)
         {

            this.shapes.smoke.draw( graphics_state, smoke_transform, this.materials.smoke_material.override({texture: this.context.get_instance(smoke_str,true)}) );

            this.shapes.smoke.draw( graphics_state, smoke_transform, this.materials.smoke_material);
         }
         else
         {
            this.shapes.smoke.draw( graphics_state, smoke_transform, this.materials.smoke_material);

            this.shapes.smoke.draw( graphics_state, smoke_transform, this.materials.smoke_material.override({texture: this.context.get_instance(smoke_str,true)}));
         }
    }

    draw_shark(graphics_state, transform)
    {
          this.shapes.shark.draw(graphics_state, transform, this.materials.shark_material);
    }

    draw_skybox(graphics_state)
    {
        var wall_transform = Mat4.identity().times(Mat4.translation([10, 700, 75])).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([this.width,this.width,0]))
        for(var i = 0; i < 9; i++)
        {
            if(i%2==0)

            this.shapes.wall.draw(graphics_state, wall_transform.times(Mat4.translation([i-2,0,0])), this.materials.wall_texture);

        }

        var wall2_transform = Mat4.identity().times(Mat4.translation([670, 415, 75])).times(Mat4.rotation(-Math.PI/2, Vec.of(0,0,1))).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([this.width,this.width,0]))
        for(var i = 0; i < 9; i++)
        {
            if(i%2==0)
            this.shapes.wall.draw(graphics_state, wall2_transform.times(Mat4.translation([i-2,0,0])), this.materials.wall_texture);
        }

        var floor_transform = Mat4.identity().times(Mat4.translation([0,0,-this.height - 0.1])).times(Mat4.scale([15,15,0]))
        for(var i = -2; i < 50; i++) //x axis
        {
            if(i%2==0)
                  for(var j = -2; j < 51; j++) //y axis
                  {
                        if(j%2==0)
                        this.shapes.floor.draw(graphics_state, floor_transform.times(Mat4.translation([i,j,0])), this.materials.floor_texture);
                  }
        }

    }

    addTime()
    {
        this.seconds++;
        if(this.seconds >= 60)
        {
            this.seconds = 0;
            this.minutes++;
        }

        this.draw_time("#595751");
        this.timer = setTimeout( () => {this.addTime();}, 1000 );
    }

    get_timeText()
    {
        //00:00
        return (this.minutes ? (this.minutes > 9 ? this.minutes : "0" + this.minutes) : "00") + ":" + (this.seconds > 9 ? this.seconds : "0" + this.seconds);
    }

    draw_time(color, clear = true)
    {
        var timeText = this.get_timeText();
        if(clear)
            this.textcanvas.clearRect(880,0,200,200);

        this.textcanvas.fillStyle = color;
        this.textcanvas.textAlign = "center";
        this.textcanvas.font = "18px PixelFont";
        this.textcanvas.fillText(timeText, 1000, 50);
    }


    draw_kills(color, clear = true)
    {
        var text = "kills: " + this.shark_kills;
        if(clear)
            this.textcanvas.clearRect(0,0,200,200);

        this.textcanvas.fillStyle= color;
        this.textcanvas.font = "18px PixelFont";
        this.textcanvas.fillText(text, 100, 50);

    }

    draw_instructions(color)
    {
      this.textcanvas.fillStyle = color;
      this.textcanvas.font = "14px PixelFont";
      this.textcanvas.fillText("Help the Octopus survive!", 40, 520);
      this.textcanvas.fillText("Ink when in front", 40, 550);
      this.textcanvas.fillText("of the Sharks", 40, 580);
      this.isDrawInstr = false;
    }

    draw_gameOver()
    {

        this.textcanvas.fillStyle = "rgba(0.5,0.5,0.5,0.2)";
        this.textcanvas.fillRect(0,0,1080,600);
        this.textcanvas.strokeRect(0,0,1080,600);
        this.textcanvas.fillStyle="#fff";
        this.textcanvas.font = "30px PixelFont";
        this.textcanvas.textAlign = "center";
        if(this.shark_kills < this.shark_t.length){
          this.textcanvas.fillText("GAME OVER", 540, 300);
        }
        else {
            this.textcanvas.fillText("YOU WIN!!", 540, 300);
        }
        this.textcanvas.font = "18px PixelFont";
        this.textcanvas.fillText("Refresh to restart", 540, 350);
        this.textcanvas.font = "14px PixelFont";
        this.textcanvas.fillText("time - " + this.get_timeText(), 540, 400);
        this.textcanvas.fillText("kills - " + this.shark_kills, 540, 420);
        this.textcanvas.fillText("number of inks - " + this.number_of_inks, 540, 440);
        let accuracy = this.number_of_inks == 0 ? "N/A" : parseInt(100*this.shark_kills/this.number_of_inks) + "%"
                 this.textcanvas.fillText("accuracy - " + accuracy, 540, 460);
        this.isGameOver = true;
    }

    //water simulation
    flow_of_water()
    {
      for(var i = 0; i < this.rows; i++)
        for(var j = 0; j < this.columns; j++)
        {

          let Hphase = i * (2*Math.PI / this.rows);
          let Vphase = j * (2*Math.PI / this.columns);
          if(i > 0 & i < this.rows-1 && j > 0 & j < this.columns-1)  //so edges not jagged
              this.flow_height[i][j] = this.flow_height[i][j] - 0.05*Math.sin(Hphase + Vphase + 4.5*this.time);
        }
    }


    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        this.time = t;

        //just to orient ourselves, by origin
        //this.shapes.axis.draw(graphics_state, Mat4.identity(), this.materials.axis_material);

        this.flow_of_water();

        //this.go_forward = false;

//         //from surfaces_demo
//         const random = ( x ) => Math.sin( 1000*x + graphics_state.animation_time/1000 );
//         this.shapes.water.positions.forEach( (p,i,a) =>
//                         a[i] = Vec.of( p[0], p[1], .15*random( i/a.length ) ));
// //         this.shapes.water.positions.forEach(p => p[2] = .5 )


        //CREATE NEW WATER SHAPE
        this.shapes.water = new ( Water.prototype.make_flat_shaded_version() )(this.rows, this.columns, this.width, this.length, this.flow_height);
        this.shapes.water.send_water(this.gl);
        this.shapes.tankedge.draw(graphics_state, Mat4.identity().times(Mat4.translation([this.width/2,this.length/2,1.6])).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([this.width/2, 1.5, this.length/2])), this.materials.edge_material);

        //this already draws octopus and sharks
        this.update_scene(graphics_state, this.time);

        for(var i = 0; i < this.shark_t.length; i++)
        {
            var shark_pos = Vec.of(this.shark_t[i][0][3],this.shark_t[i][1][3],this.shark_t[i][2][3]);
            if(this.is_sunk[i] == false && !this.isGameOver){
            this.collision_detection_ink(graphics_state, shark_pos, i);
            this.collision_detection(graphics_state, shark_pos);
            }

            //console.log(shark_pos)
        }
        if(this.shark_kills)
          this.draw_kills("#595751");

        if(this.isDrawInstr)
            this.draw_instructions("#595751");

        //DRAW CAUSTICS//
        if (this.caustic_counter >= 99)
            this.caustic_counter = 0;

        if(this.caustic_update)
        {
            this.caustic_counter += 1;
            this.caustic_update = false;
        }
        else
            this.caustic_update = true;

         var caustic_str = "assets/Caustic/target-" + this.caustic_counter.toString() +  ".png";

         var caustic_transform = Mat4.identity().times(Mat4.translation([ this.width/8, this.length/8, -this.height ]))
                                                .times(Mat4.scale([ this.width/8, this.length/8, 1 ]));
         if(!this.gif_ready)
         {
            for(var i = 0; i < 7; i++)
            {
                for(var j = 0; j < 7; j++)
                {
                    if(i%2==0 && j%2==0)
                    {
                        this.shapes.caustic.draw( graphics_state, caustic_transform.times(Mat4.translation([ i,j,0 ])), this.materials.caustic_material.override({texture: this.context.get_instance(caustic_str,true)}) );
                        this.shapes.caustic.draw( graphics_state, caustic_transform.times(Mat4.translation([ i,j,0 ])), this.materials.caustic_material);
                    }
                }
            }
         }
         else
         {
             for(var i = 0; i < 7; i++)
            {
                for(var j = 0; j < 7; j++)
                {
                    if(i%2==0 && j%2==0)
                    {
                        this.shapes.caustic.draw( graphics_state, caustic_transform.times(Mat4.translation([ i,j,0 ])), this.materials.caustic_material);
                        this.shapes.caustic.draw( graphics_state, caustic_transform.times(Mat4.translation([ i,j,0 ])), this.materials.caustic_material.override({texture: this.context.get_instance(caustic_str,true)}));
                    }
                }
            }
         }

        //ours
        let water_transform = Mat4.identity().times( Mat4.translation([0, 0, 0]) ); //make whole surface go up and down
        this.shapes.water.draw(graphics_state, water_transform, this.materials.water_material, "TRIANGLE_STRIP");
        //console.log(this.shapes.water.positions)



        //DRAW TANK//
        let tank_transform = Mat4.identity().times(Mat4.translation([this.width/2, this.length/2, -this.height/2]))
                                            .times(Mat4.scale([this.width/2, this.length/2, -this.height/2]));
        this.shapes.tank.draw(graphics_state, tank_transform, this.materials.water_material);

        this.draw_skybox(graphics_state);



        this.draw_ink(graphics_state, this.ink_t);





      }//end of display


  }
