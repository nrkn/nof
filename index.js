'use strict'

const ObjectFactory = opts => {  
  const options = Object.assign( {}, ObjectFactory.defaults, opts )
  
  const { 
    name, 
    properties, 
    propertyTransform,
    mixins
  } = options
  
  const Factory = ( ...args ) => {
    const instance = {
      name: () => name,
      
      keys: () => properties.slice(),
      
      clone: () => Factory.from( instance.data() ),
      
      toArray: () => properties.map( name => instance[ name ] ),
      
      toString: () => JSON.stringify( instance.toArray() ),
      
      data: () => properties.reduce( 
        ( obj, name ) => {
          obj[ name ] = instance[ name ]
        
          return obj
        }, 
        {} 
      )      
    }
    
    properties.forEach( ( name, i ) =>
      instance[ name ] = propertyTransform( name, args[ i ] )
    )
    
    if( mixins !== undefined ){
      Object.keys( mixins ).forEach( key =>
        instance[ key ] = ( ...args ) => 
          mixins[ key ]( ...[ instance ].concat( args ) )
      )
    }
    
    return instance
  }
  
  Factory.from = obj => 
    Array.isArray( obj ) ?
      Factory( ...obj ) :
      Factory( ...properties.map( name => obj[ name ] ))
  
  Factory.parse = json => {
    const arr = JSON.parse( json )
    
    if( !Array.isArray( arr ) ){
      throw new Error( "Expected a JSON array" )
    }
        
    return Factory( ...arr )
  }
  
  return Factory  
}

ObjectFactory.defaults = {
  propertyTransform: ( name, value ) => value
}

module.exports = ObjectFactory
