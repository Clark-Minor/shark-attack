window.Cube = window.classes.Cube =
class Cube extends Shape    // A cube inserts six square strips into its arrays.
{ constructor()
    { super( "positions", "normals", "texture_coords" );
      for( var i = 0; i < 3; i++ )
        for( var j = 0; j < 2; j++ )
        { var square_transform = Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) )
                         .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                         .times( Mat4.translation([ 0, 0, 1 ]) );
          Square.insert_transformed_copy_into( this, [], square_transform );
        }
    }
}






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

window.Shark = window.classes.Shark =
class Shark extends Shape
{
  constructor()
      { super("positions", "normals", "texture_coords");
            var body_t = Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([3,1,2]))
            var head_t = Mat4.identity().times(Mat4.translation([3.5,0,0])).times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0))).times(Mat4.scale([1,1.1,1]))
            var bottom_t = Mat4.identity().times(Mat4.translation([-3,0,0])).times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0))).times(Mat4.scale([1,1.1,1]))
            var tail_t = Mat4.identity().times(Mat4.translation([-3,0,0])).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([1.5,1.5,1.5]))
            var fin_t = Mat4.identity().times(Mat4.translation([0,0,0.3])).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([2,2,2]))
            Rounded_Capped_Cylinder.insert_transformed_copy_into(this, [15,15], body_t);
            Rounded_Closed_Cone.insert_transformed_copy_into(this, [15,15], head_t);
            Rounded_Closed_Cone.insert_transformed_copy_into(this, [15,15], bottom_t);
            Triangle2.insert_transformed_copy_into(this, [], tail_t);
            Triangle.insert_transformed_copy_into(this, [], fin_t);
      }
}

class Texture_Caustic extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #6.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
   
          vec4 tex_color = texture2D( texture, f_tex_coord);                         // Sample the texture image in the correct place.
          vec3 bumped_N = normalize( N + tex_color.rgb - 0.5 * vec3(1,1,1) );
                                                                                     // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( bumped_N );                     // Compute the final color with contributions from lights.
        }`;
    }
}




// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function,
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused.
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        {
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        {
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );


                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)
      } }









window.Project_Scene = window.classes.Project_Scene =
class Project_Scene extends Scene_Component
  { constructor( context, control_box, gl, text_canvas )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );
            
        //context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );
        context.globals.graphics_state.camera_transform = Mat4.translation([ -5,-5,-70 ]);

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );


        this.rows = 70;
        this.columns = 70;
        this.width = 95;  //x
        this.length = 70; //y
        this.height = 20; //z
        this.Height_Map = [];
        this.time = 0;
        this.gl = gl;

        //random z for water//
        for(var i=0; i< this.rows; i++)
        {
          let Row = [];
          for(var j=0; j< this.columns; j++)
          {
            if(i>0 && i<this.rows-1 && j>0 && j<this.columns-1)
                Row.push(3*Math.random());
            else
                Row.push(0);
          }
          this.Height_Map.push(Row);
        }
        
        //for caustics//    
        this.caustic_counter = 0;
        this.caustic_update = true;
        this.gif_ready = false;
        setTimeout( () => { this.gif_ready = true; }, 20000 );
        for(var i = 0; i < 100; i++)
        {
            var img = new Image();
            img.src = "assets/Caustic/target-" + i + ".png";
        }
        


        this.shapes = {  torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),

                         // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                         //        (Requirement 1)
                         axis: new Axis_Arrows(),

                         water: new Water(this.rows, this.columns, this.width, this.length, this.Height_Map),
                         caustic: new Square(),
                         tank: new Body_Of_Water(),
                         skybox: new Cube(),

                         octopus: new Octopus(),
                         eyes: new Octopus_Eyes(),

                         shark: new Shark(),
                         
                         wall: new Square(),
                         floor: new Square()

                        }

        this.context = context;
        this.submit_shapes( this.context, this.shapes );

        // Make some Material objects available to you:
        this.materials =
          { axis_material:     context.get_instance( Phong_Shader ).material(Color.of(1,1,1,1)),
            
            water_material:     context.get_instance( Phong_Shader ).material(Color.of( /*36/255, 171/255, 255/255,*/56/255, 213/255, 252/255, 0.6 ),
            {
              ambient: 0.6,
              diffusivity: 0.1,
              specular: 0.5,
              smoothness: 80   //fuck is the difference???
            }),

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

            octopus_skin: context.get_instance( Phong_Shader ).material(Color.of(204/255,0,170/255,1),
            {
                ambient: 1,  
                //diffusivity: 1,
                specular: 0.5,
            }),

            eye_material: context.get_instance( Phong_Shader ).material(Color.of(1,1,1,1), {ambient: 0.8}),

            caustic_material: context.get_instance( Texture_Caustic ).material(Color.of( 0,0,0,1 ), 
            {
                  ambient: 0.4, 
                  texture: context.get_instance("assets/Caustic/target-0.png",true)
            }),

            shark_material: context.get_instance( Phong_Shader ).material(Color.of(158/255,154/255,144/255,1),
            {
                  ambient: 0.5,
            }),

          }

        //(position, color, size)
        //this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
        this.lights = [ new Light( Mat4.identity().times(Vec.of(1,1,1,1)), Color.of(1, .4, 1, 1), 1000 ) ];
        
//         this.lights = [ new Light( Vec.of( 0,5,5,1 ), Color.of( 1, .4, 1, 1 ), 100000 ), 
//                         new Light( Vec.of( 0,5,5,-1 ), Color.of( 1, .4, 1, 1 ), 1000 ), 
//                         new Light( Mat4.identity().times(Vec.of( 100,5,80,1 )), Color.of( 1, .4, 1, 1 ), 100000 ),];


      } //end of constructor

    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }

    draw_octopus(graphics_state)
    {
        var octopus_t = Mat4.identity().times(Mat4.translation(Vec.of(this.width/2,this.length/2,5))).times(Mat4.rotation(-2*Math.PI/3, Vec.of(0,0,1)))
        this.shapes.octopus.draw(graphics_state, octopus_t, this.materials.octopus_skin);
        this.shapes.eyes.draw(graphics_state, octopus_t, this.materials.eye_material);
    }

    draw_shark(graphics_state)
    {
          var shark_t = Mat4.identity().times(Mat4.translation([5,5,1.25]))
          this.shapes.shark.draw(graphics_state, shark_t, this.materials.shark_material);
    }

    draw_skybox(graphics_state)
    {
        var wall_transform = Mat4.identity().times(Mat4.translation([0, 700, 75])).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([this.width*3,this.width*3,0]))
        for(var i = 0; i < 9; i++)
        {
            if(i%2==0)
            this.shapes.wall.draw(graphics_state, wall_transform.times(Mat4.translation([i,0,0])), this.materials.wall_texture);
        }

        var wall2_transform = Mat4.identity().times(Mat4.translation([700, 400, 75])).times(Mat4.rotation(-Math.PI/2, Vec.of(0,0,1))).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([this.width*3,this.width*3,0]))
        for(var i = 0; i < 9; i++)
        {
            if(i%2==0)
            this.shapes.wall.draw(graphics_state, wall2_transform.times(Mat4.translation([i,0,0])), this.materials.wall_texture);
        }

        var floor_transform = Mat4.identity().times(Mat4.translation([0,0,-this.height - 0.1])).times(Mat4.scale([15,15,0]))
        for(var i = -2; i < 50; i++) //x axis
        {
            if(i%2==0)
                  for(var j = -2; j < 50; j++) //y axis
                  {
                        if(j%2==0)
                        this.shapes.floor.draw(graphics_state, floor_transform.times(Mat4.translation([i,j,0])), this.materials.floor_texture);
                  }        
        }
       
    }

    //PHASE SKETCH
    flow_of_water()
    {
      for(var i = 0; i < this.rows; i++)
        for(var j = 0; j < this.columns; j++)
        {

          let phase = i * (2*Math.PI / this.rows);
          let phase2 = j * (2*Math.PI / this.columns);
          if(i > 0 & i < this.rows-1 && j > 0 & j < this.columns-1)  //so edges not jagged
              this.Height_Map[i][j] = this.Height_Map[i][j] - 0.05*Math.sin(phase + phase2 + 4.5*this.time);
        }
    }    


    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        this.time = t;


        //just to orient ourselves, by origin
        this.shapes.axis.draw(graphics_state, Mat4.identity(), this.materials.axis_material);
        
        this.flow_of_water();

//         //from surfaces_demo
//         const random = ( x ) => Math.sin( 1000*x + graphics_state.animation_time/1000 );
//         this.shapes.water.positions.forEach( (p,i,a) =>
//                         a[i] = Vec.of( p[0], p[1], .15*random( i/a.length ) ));
// //         this.shapes.water.positions.forEach(p => p[2] = .5 )


        //CREATE NEW WATER SHAPE
        this.shapes.water = new Water(this.rows, this.columns, this.width, this.length, this.Height_Map);
        this.shapes.water.send_water(this.gl);



        //this.shapes.skybox.draw(graphics_state, Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([500,500,500])), this.materials.box_texture);

        //DRAW OCTOPUS//
        this.draw_octopus(graphics_state);

        //DRAW SHARK//
        this.draw_shark(graphics_state);

        //DRAW CAUSTICS//
        if (this.caustic_counter == 99)
            this.caustic_counter = 0;
        
        if(this.caustic_update)
        {
            this.caustic_counter += 1;
            this.caustic_update = false;
        }
        else
            this.caustic_update = true;

         var caustic_str = "assets/Caustic/target-" + this.caustic_counter.toString() +  ".png";
         
         if(!this.gif_ready)
         {
            
            this.shapes.caustic.draw( graphics_state, Mat4.identity().times(Mat4.translation([ this.width/2, this.length/2, -this.height ]))
                                                                     .times(Mat4.scale([ this.width/2, this.length/2, 1 ]))
                                                      ,this.materials.caustic_material.override({texture: this.context.get_instance(caustic_str,true)}) );   
            this.shapes.caustic.draw( graphics_state, Mat4.identity().times(Mat4.translation([ this.width/2, this.length/2, -this.height ]))
                                                                     .times(Mat4.scale([ this.width/2, this.length/2, 1 ])) 
                                                      ,this.materials.caustic_material);   
         }
         else
         {
             this.shapes.caustic.draw( graphics_state, Mat4.identity().times(Mat4.translation([ this.width/2, this.length/2, -this.height ]))
                                                                      .times(Mat4.scale([ this.width/2, this.length/2, 1 ]))
                                                       ,this.materials.caustic_material);   

             this.shapes.caustic.draw( graphics_state, Mat4.identity().times(Mat4.translation([ this.width/2, this.length/2, -this.height ]))
                                                                      .times(Mat4.scale([ this.width/2, this.length/2, 1 ]))
                                                       ,this.materials.caustic_material.override({texture: this.context.get_instance(caustic_str,true)}));   
         }

        //ours
        let water_transform = Mat4.identity().times( Mat4.translation([0, 0, 0]) ); //make whole surface go up and down
        this.shapes.water.draw(graphics_state, water_transform, this.materials.water_material);
        //console.log(this.shapes.water.positions)



        //DRAW TANK//
        let tank_transform = Mat4.identity().times(Mat4.translation([this.width/2, this.length/2, -this.height/2]))
                                            .times(Mat4.scale([this.width/2, this.length/2, -this.height/2]));
        this.shapes.tank.draw(graphics_state, tank_transform, this.materials.water_material);
        
        this.draw_skybox(graphics_state);


      }//end of display


  }







window.Scene = window.classes.Scene
class Scene
{                           // **Scene** is the base class for any scene part or code snippet that you can add to a
                            // canvas.  Make your own subclass(es) of this and override their methods "display()" 
                            // and "make_control_panel()" to make them draw to a canvas, or generate custom control
                            // buttons and readouts, respectively.  Scenes exist in a hierarchy; their child Scenes
                            // can either contribute more drawn shapes or provide some additional tool to the end 
                            // user via drawing additional control panel buttons or live text readouts.
  constructor()
    { this.children = [];
                                                          // Set up how we'll handle key presses for the scene's control panel:
      const callback_behavior = ( callback, event ) => 
           { callback( event );
             event.preventDefault();    // Fire the callback and cancel any default browser shortcut that is an exact match.
             event.stopPropagation();   // Don't bubble the event to parent nodes; let child elements be targetted in isolation.
           }
      this.key_controls = new Keyboard_Manager( document, callback_behavior);     
    }
  new_line( parent=this.control_panel )       // new_line():  Formats a scene's control panel with a new line break.
    { parent.appendChild( document.createElement( "br" ) ) }
  live_string( callback, parent=this.control_panel )
    {                                             // live_string(): Create an element somewhere in the control panel that
                                                  // does reporting of the scene's values in real time.  The event loop
                                                  // will constantly update all HTML elements made this way.
      parent.appendChild( Object.assign( document.createElement( "div"  ), { className:"live_string", onload: callback } ) );
    }
  key_triggered_button( description, shortcut_combination, callback, color = '#'+Math.random().toString(9).slice(-6), 
                        release_event, recipient = this, parent = this.control_panel )
    {                                             // key_triggered_button():  Trigger any scene behavior by assigning
                                                  // a key shortcut and a labelled HTML button to fire any callback 
                                                  // function/method of a Scene.  Optional release callback as well.
      const button = parent.appendChild( document.createElement( "button" ) );
      button.default_color = button.style.backgroundColor = color;
      const  press = () => { Object.assign( button.style, { 'background-color' : 'red', 
                                                            'z-index': "1", 'transform': "scale(2)" } );
                             callback.call( recipient );
                           },
           release = () => { Object.assign( button.style, { 'background-color' : button.default_color, 
                                                            'z-index': "0", 'transform': "scale(1)" } );
                             if( !release_event ) return;
                             release_event.call( recipient );
                           };
      const key_name = shortcut_combination.join( '+' ).split( " " ).join( "Space" );
      button.textContent = "(" + key_name + ") " + description;
      button.addEventListener( "mousedown" , press );
      button.addEventListener( "mouseup",  release );
      button.addEventListener( "touchstart", press, { passive: true } );
      button.addEventListener( "touchend", release, { passive: true } );
      if( !shortcut_combination ) return;
      this.key_controls.add( shortcut_combination, press, release );
    }                                                          
                                                // To use class Scene, override at least one of the below functions,
                                                // which will be automatically called by other classes:
  display( context, program_state )
    {}                            // display(): Called by Webgl_Manager for drawing.
  make_control_panel()
    {}                            // make_control_panel(): Called by Controls_Widget for generating interactive UI.
  show_explanation( document_section )
    {}                            // show_explanation(): Called by Text_Widget for generating documentation.
}



class Shape_From_File extends Shape
{                                   // **Shape_From_File** is a versatile standalone Shape that imports
                                    // all its arrays' data from an .obj 3D model file.
  constructor( filename )
    { super( "position", "normal", "texture_coord" );
                                    // Begin downloading the mesh. Once that completes, return
                                    // control to our parse_into_mesh function.
      this.load_file( filename );
    }
  load_file( filename )
      {                             // Request the external file and wait for it to load.
                                    // Failure mode:  Loads an empty shape.
        return fetch( filename )
          .then( response =>
            { if ( response.ok )  return Promise.resolve( response.text() )
              else                return Promise.reject ( response.status )
            })
          .then( obj_file_contents => this.parse_into_mesh( obj_file_contents ) )
          .catch( error => { this.copy_onto_graphics_card( this.gl ); } )
      }
  parse_into_mesh( data )
    {                           // Adapted from the "webgl-obj-loader.js" library found online:
      var verts = [], vertNormals = [], textures = [], unpacked = {};   

      unpacked.verts = [];        unpacked.norms = [];    unpacked.textures = [];
      unpacked.hashindices = {};  unpacked.indices = [];  unpacked.index = 0;

      var lines = data.split('\n');

      var VERTEX_RE = /^v\s/;    var NORMAL_RE = /^vn\s/;    var TEXTURE_RE = /^vt\s/;
      var FACE_RE = /^f\s/;      var WHITESPACE_RE = /\s+/;

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        var elements = line.split(WHITESPACE_RE);
        elements.shift();

        if      (VERTEX_RE.test(line))   verts.push.apply(verts, elements);
        else if (NORMAL_RE.test(line))   vertNormals.push.apply(vertNormals, elements);
        else if (TEXTURE_RE.test(line))  textures.push.apply(textures, elements);
        else if (FACE_RE.test(line)) {
          var quad = false;
          for (var j = 0, eleLen = elements.length; j < eleLen; j++)
          {
              if(j === 3 && !quad) {  j = 2;  quad = true;  }
              if(elements[j] in unpacked.hashindices) 
                  unpacked.indices.push(unpacked.hashindices[elements[j]]);
              else
              {
                  var vertex = elements[ j ].split( '/' );

                  unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 0]);
                  unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 1]);   
                  unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 2]);
                  
                  if (textures.length) 
                    {   unpacked.textures.push(+textures[( (vertex[1] - 1)||vertex[0]) * 2 + 0]);
                        unpacked.textures.push(+textures[( (vertex[1] - 1)||vertex[0]) * 2 + 1]);  }
                  
                  unpacked.norms.push(+vertNormals[( (vertex[2] - 1)||vertex[0]) * 3 + 0]);
                  unpacked.norms.push(+vertNormals[( (vertex[2] - 1)||vertex[0]) * 3 + 1]);
                  unpacked.norms.push(+vertNormals[( (vertex[2] - 1)||vertex[0]) * 3 + 2]);
                  
                  unpacked.hashindices[elements[j]] = unpacked.index;
                  unpacked.indices.push(unpacked.index);
                  unpacked.index += 1;
              }
              if(j === 3 && quad)   unpacked.indices.push( unpacked.hashindices[elements[0]]);
          }
        }
      }
      {
      const { verts, norms, textures } = unpacked;
        for( var j = 0; j < verts.length/3; j++ )
        { 
          this.arrays.position     .push( vec3( verts[ 3*j ], verts[ 3*j + 1 ], verts[ 3*j + 2 ] ) );        
          this.arrays.normal       .push( vec3( norms[ 3*j ], norms[ 3*j + 1 ], norms[ 3*j + 2 ] ) );
          this.arrays.texture_coord.push( vec( textures[ 2*j ], textures[ 2*j + 1 ] ) );
        }
        this.indices = unpacked.indices;
      }
      this.normalize_positions( false );
      this.ready = true;
    }
  draw( context, program_state, model_transform, material )
    {               // draw(): Same as always for shapes, but cancel all 
                    // attempts to draw the shape before it loads:
      if( this.ready )
        super.draw( context, program_state, model_transform, material );
    }
}

class Obj_File_Demo extends Scene     
  {                           // **Obj_File_Demo** show how to load a single 3D model from an OBJ file.
                              // Detailed model files can be used in place of simpler primitive-based
                              // shapes to add complexity to a scene.  Simpler primitives in your scene
                              // can just be thought of as placeholders until you find a model file
                              // that fits well.  This demo shows the teapot model twice, with one 
                              // teapot showing off the Fake_Bump_Map effect while the other has a 
                              // regular texture and Phong lighting.             
    constructor()                               
      { super();
                                      // Load the model file:
        this.shapes = { "octo": new Shape_From_File( "assets/Octopus.obj" ) };

                                      // Don't create any DOM elements to control this scene:
        this.widget_options = { make_controls: false };
                                                          // Non bump mapped:
        this.stars = new Material( new defs.Textured_Phong( 1 ),  { color: color( .5,.5,.5,1 ), 
          ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });
                                                           // Bump mapped:
        this.bumps = new Material( new defs.Fake_Bump_Map( 1 ), { color: color( .5,.5,.5,1 ), 
          ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });
      }
    display( context, program_state )
      { const t = program_state.animation_time;

        program_state.set_camera( Mat4.translation( 0,0,-5 ) );    // Locate the camera here (inverted matrix).                  
        program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 500 );
                                                // A spinning light to show off the bump map:
        program_state.lights = [ new Light( 
                                 Mat4.rotation( t/300,   1,0,0 ).times( vec4( 3,2,10,1 ) ), 
                                             color( 1,.7,.7,1 ), 100000 ) ];
        
        for( let i of [ -1, 1 ] )
        {                                       // Spin the 3D model shapes as well.
          const model_transform = Mat4.rotation( t/2000,   0,2,1 )
                          .times( Mat4.translation( 2*i, 0, 0 ) )
                          .times( Mat4.rotation( t/1500,   -1,2,0 ) )
                          .times( Mat4.rotation( -Math.PI/2,   1,0,0 ) );
          this.shapes.octo.draw( context, program_state, model_transform, i == 1 ? this.stars : this.bumps );
        }
      }
  show_explanation( document_element )
    { document_element.innerHTML += "<p>This demo loads an external 3D model file of a teapot.  It uses a condensed version of the \"webgl-obj-loader.js\" "
                                 +  "open source library, though this version is not guaranteed to be complete and may not handle some .OBJ files.  It is contained in the class \"Shape_From_File\". "
                                 +  "</p><p>One of these teapots is lit with bump mapping.  Can you tell which one?</p>";
    }
  }

