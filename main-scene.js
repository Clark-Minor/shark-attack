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

window.Project_Scene = window.classes.Project_Scene =
class Project_Scene extends Scene_Component
  { constructor( context, control_box, gl )     // The scene begins by requesting the camera, shapes, and materials it will need.
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
        this.height = 20;
        this.Height_Map = [];
        this.time = 1;
        
//         //random z
//         for(var i=0; i< this.rows; i++)
//         {
//           let Row = [];
//           for(var j=0; j< this.columns; j++)
//           {
//             if(i>0 && i<this.rows-1 && j>0 && j<this.columns-1)
//                 Row.push(3*Math.random());    
//             else
//                 Row.push(0);       
//           }
//           this.Height_Map.push(Row);  
//         }

    

        //PHASE SKETCH
        function flow_of_water(ttt)
        {
          for(var i = 0; i < this.rows; i++)
            for(var j = 0; j < this.columns; j++)
            {

              let phase = i * (2 * Math.PI / this.rows);
              let phase2 = j * (2 * Math.PI / this.columns);
              if(i > 0 & i < this.rows-1 && j > 0 & j < this.columns-1)  //so edges not jagged
                  this.Height_Map[i][j] = 3*Math.random() - .05*Math.sin(phase + 4.5*ttt);                                                                  
            }    
        }
      

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
 
                         // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                         //        (Requirement 1)
                         triangle_for_water: new Triangle2(0,0,0, 1,0,0, 0,1,0),  //3 points
                         triangle_for_water2: new Triangle2(0,1,0, 1,0,0, 1,1,0),
                         triangle_for_water3: new Triangle2(1,0,0, 1,1,0, 2,1,0),
                         triangle_for_water4: new Triangle2(1,0,0, 2,0,0, 2,1,0),
                         triangle_for_water5: new Triangle2(2,1,0, 1,1,0, 2,2,0),
                         triangle_for_water6: new Triangle2(2,2,0, 1,1,0, 1,2,0),
                         triangle_for_water7: new Triangle2(1,2,0, 1,1,0, 0,2,0),
                         triangle_for_water8: new Triangle2(0,2,0, 0,1,0, 1,1,0),
                         
                         water: new Water(this.rows, this.columns, this.width, this.length, this.Height_Map),
                         tank: new Body_Of_Water(),
                         skybox: new Cube(),
                        }

       
        this.submit_shapes( context, shapes );                             
        
        // Make some Material objects available to you:
        this.materials =
          { water_material:     context.get_instance( Phong_Shader ).material(Color.of( 36/255, 171/255, 255/255, 0.6 ), 
            { 
              ambient: 0.6,
              diffusivity: 0.1,
              specular: 0.5,
              smoothness: 80   //fuck is the difference??? 
            }),
            ring:     context.get_instance( Ring_Shader  ).material(),

            box_texture: context.get_instance( Phong_Shader ).material(Color.of(0, 0, 0, 1), //opaque black
            {
                ambient: 1,  //ambient coefficient 1
                texture: context.get_instance("assets/skysky.png", true) //true = trilinear filtering
            })       
          }

        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
        

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


    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        this.time = t;
        

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)

        //just to orient ourselves, by origin
        this.shapes.triangle_for_water.draw( graphics_state, Mat4.identity(), this.materials.water_material );
        this.shapes.triangle_for_water2.draw( graphics_state, Mat4.identity(), this.materials.water_material.override({color: Color.of(1,0,0,1)}) );
        this.shapes.triangle_for_water3.draw( graphics_state, Mat4.identity(), this.materials.water_material.override({color: Color.of(0,0,0,1)}) );
        this.shapes.triangle_for_water4.draw( graphics_state, Mat4.identity(), this.materials.water_material.override({color: Color.of(0,1,0,1)}) );
        this.shapes.triangle_for_water5.draw( graphics_state, Mat4.identity(), this.materials.water_material.override({color: Color.of(1,0,0,1)}) );
        this.shapes.triangle_for_water6.draw( graphics_state, Mat4.identity(), this.materials.water_material.override({color: Color.of(0,0,1,1)}) );
        this.shapes.triangle_for_water7.draw( graphics_state, Mat4.identity(), this.materials.water_material.override({color: Color.of(1,0,0,1)}) );
        this.shapes.triangle_for_water8.draw( graphics_state, Mat4.identity(), this.materials.water_material.override({color: Color.of(1,1,0,1)}) );      
        
        

        //this.flow_of_water(this.time);

        this.shapes.skybox.draw(graphics_state, Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([100,100,100])), this.materials.box_texture);

        //from surfaces_demo
        const random = ( x ) => Math.sin( 1000*x + graphics_state.animation_time/1000 );
        console.log(graphics_state.animation_time)
//         this.shapes.water.positions.forEach( (p,i,a) => 
//                         a[i] = Vec.of( p[0], p[1], .15*random( i/a.length ) ) );
          this.shapes.water.positions.forEach(p => p[2] = .5 )
        console.log(this.shapes.water.positions)
        this.shapes.water.make_flat_shaded_version();
        //ours
        let water_transform = Mat4.identity().times( Mat4.translation([0, 0, 0]) ); //make whole surface go up and down
        this.shapes.water.draw(graphics_state, water_transform, this.materials.water_material);


        
        let tank_transform = Mat4.identity().times(Mat4.translation([this.width/2, this.length/2, -this.height/2]))
                                            .times(Mat4.scale([this.width/2, this.length/2, -this.height/2]));
        this.shapes.tank.draw(graphics_state, tank_transform, this.materials.water_material);
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
            this.positions.push( Vec.of(x, y, random_height(0,3))); //random z vertex so surface of water not so uniform waves
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
  
//      send_water(gl)
//      {
//          this.copy_onto_graphics_card(gl, ["positions", "normals"], false);  
//      }


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
        this.indices.push( 0, 1, 2, 1, 3, 2,        //without top part / "lid"
                           8, 9, 10, 9, 11, 10, 
                           12, 13, 14, 13, 15, 14, 
                           16, 17, 18, 17, 19, 18, 
                           20, 21, 22, 21, 23, 22);
        // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
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







