/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */


THREE.DeviceOrientationControls = function ( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( 'YXZ' );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alphaOffset = 0; // radians
	
	

 

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};//判断屏幕方向是否发生变化
	
	
	/*var function getBaseQuaternion(beta,gamma,alpha) {
    var d = Math.PI / 180;
	var x = beta  ? beta*d : 0; // 取beta得弧度值
	var y = gamma? gamma * d : 0; // gamma value
	var z = alpha ? alpha * d : 0; // alpha value

	var cX = Math.cos( x/2 );
	var cY = Math.cos( y/2 );
	var cZ = Math.cos( z/2 );
	var sX = Math.sin( x/2 );
	var sY = Math.sin( y/2 );
	var sZ = Math.sin( z/2 );

	var w = cX * cY * cZ - sX * sY * sZ;
	var x = sX * cY * cZ - cX * sY * sZ;
	var y = cX * sY * cZ + sX * cY * sZ;
	var z = cX * cY * sZ + sX * sY * cZ;
	var xuan = new THREE.Vector3( x, y, z );
	var q = new THREE.Quaternion();
     return q.setFromAxisAngle( xuan, w );

	};
*/

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zxuan = new THREE.Vector3( 0, 0, 1 );//新建一个指向正z轴的向量

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( Math.sqrt( 0.5 ), 0, 0, -Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

		//	euler.set( beta, gamma, alpha, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us
			euler.set( beta, alpha, -gamma, 'YXZ' ); 
			//quaternion.copy(getBaseQuaternion( beta, alpha, - gamma));
			
			//欧拉角转化为四元数
	         var x = beta;// 取beta得弧度值
	         var y = alpha; // gamma value
	         var z = -gamma; // alpha value
			 
		   var c1 = Math.cos( x/2 );
	       var c2 = Math.cos( y/2 );
	       var c3 = Math.cos( z/2 );
	       var s1 = Math.sin( x/2 );
	       var s2 = Math.sin( y/2 );
	       var s3 = Math.sin( z/2 );

	   	   var x1 = s1 * c2 * c3 + c1 * s2 * s3;
		   var y1 = c1 * s2 * c3 - s1 * c2 * s3;
		   var z1 = c1 * c2 * s3 - s1 * s2 * c3;
		   var w1 = c1 * c2 * c3 + s1 * s2 * s3;
	       var q3 = new THREE.Quaternion(x1, y1, z1, w1 );
		   quaternion.copy(q3);
		   //quaternion.setFromEuler( euler ); // orient the device从欧拉角得到四元数
		   
		   
		   //四元数乘法
		   /*
		   	var qax =quaternion._x, qay =quaternion._y, qaz =quaternion._z, qaw = quaternion._w;
	        var qbx = q1._x, qby = q1._y, qbz = q1._z, qbw = q1._w;
            var x2 = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            var y2 = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            var z2 = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
	        var w2 = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
		    var q4 = new THREE.Quaternion(x2, y2, z2, w2 );
		    quaternion.copy(q4);
		 */
         
			//quaternion.multiply( q1 ); // camera looks out the back of the device, not the top
            
			quaternion.multiply( q0.setFromAxisAngle( zxuan, - orient ) ); // adjust for screen orientation

		};

	}();
	
	
	
	
	
	/*
 //四元数乘法
 var function quaternionMultiply( a, b ) {
	var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
	var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
	//var w = a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3];
	//var x = a[1] * b[0] + a[0] * b[1] + a[2] * b[3] - a[3] * b[2];
	//var y = a[2] * b[0] + a[0] * b[2] + a[3] * b[1] - a[1] * b[3];
	//var z = a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1];
    var x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    var y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    var z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
	var w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
	var xuan = new THREE.Vector3( x, y, z );
	var q = new THREE.Quaternion();
	return q.setFromAxisAngle( xuan, w );
}
	*/

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );//浏览器绑定
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function () {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var device = scope.deviceOrientation;

		if ( device ) {

			var alpha = device.alpha ? THREE.Math.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

			var beta = device.beta ? THREE.Math.degToRad( device.beta ) : 0; // X'

			var gamma = device.gamma ? THREE.Math.degToRad( device.gamma ) : 0; // Y''

			var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O
			

			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

		}


	};

	this.dispose = function () {

		scope.disconnect();

	};

	this.connect();

};
