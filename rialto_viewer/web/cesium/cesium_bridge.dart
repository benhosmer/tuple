// Copyright (c) 2014-2015, RadiantBlue Technologies, Inc.
// This file may only be used under the MIT-style
// license found in the accompanying LICENSE.txt file.

part of rialto.viewer;


// this serves as an interface to the JavaScript functions in CesiumBridge
class CesiumBridge {
    JsObject _bridge;

    CesiumBridge(String elementName) {
        _bridge = new JsObject(context['CesiumBridge'], [elementName]);
    }

    bool isPrimitiveVisible(var primitive) {
        return _bridge.callMethod('isPrimitiveVisible', [primitive]);
    }

    void setPrimitiveVisible(var primitive, bool value) {
        _bridge.callMethod('setPrimitiveVisible', [primitive, value]);
    }

    // eye & taregt inputs in cartographic lat/lon, height in kilometers
    // up vector is cartsian
    void lookAt(double eyeLon, double eyeLat, double eyeHeight, double targetLon, double targetLat, double targetHeight,
            double upX, double upY, double upZ, double fovDegrees) {
        _bridge.callMethod(
                'lookAtCartographic',
                [eyeLon, eyeLat, eyeHeight * 1000.0, targetLon, targetLat, targetHeight * 1000.0, upX, upY, upZ, fovDegrees]);
    }

    void onMouseMove(f) => _bridge.callMethod('onMouseMove', [f]);
    void onMouseDown(f) => _bridge.callMethod('onMouseDown', [f]);
    void onMouseUp(f) => _bridge.callMethod('onMouseUp', [f]);
    void onMouseWheel(f) => _bridge.callMethod('onMouseWheel', [f]);

    void setUpdateFunction(f) {
        _bridge.callMethod('setUpdater', [f]);
    }

    dynamic createFloat64Array(int len) {
        return new JsObject(context['Float64Array'], [len]);
    }

    dynamic createUint8Array(int len) {
        return new JsObject(context['Uint8Array'], [len]);
    }

    static bool _isValidLatLon(Vector3 v) {
        const zmax = 100000;
        return (v.x >= -180.0 && v.x <= 180.0) && (v.y >= -90.0 && v.y <= 90.0) && (v.z >= -zmax && v.z <= zmax);
    }

    Vector3 get cameraEyePosition {
        assert(false);
        return null;
    }

    void set cameraEyePosition(Vector3 value) {
        assert(_isValidLatLon(value));
        assert(false);
    }

    Vector3 get cameraTargetPosition {
        assert(false);
        return null;
    }

    void set cameraTargetPosition(Vector3 value) {
        assert(_isValidLatLon(value));
        assert(false);
    }

    Vector3 get cameraUpDirection {
        assert(false);
        return null;
    }

    void set cameraUpDirection(Vector3 value) {
        assert(_isValidLatLon(value));
        assert(false);
    }

    Vector3 getMouseCoordinates(int windowX, int windowY) {
        var xyz = _bridge.callMethod('getMouseCoords', [windowX, windowY]);
        if (xyz == null) return null;
        double x = xyz[0].toDouble();
        double y = xyz[1].toDouble();
        double z = xyz[2].toDouble();
        return new Vector3(x, y, z);
    }

    int getPickedShapeId() {
        assert(false);
        return null;
    }

    // the geometry construction functions return the primitive we made (as an opaque pointer)
    dynamic createRectangle(Vector3 point1, Vector3 point2, double colorR, double colorG, double colorB) {
        assert(_isValidLatLon(point1));
        assert(_isValidLatLon(point2));
        return _bridge.callMethod('createRectangle', [point1.x, point1.y, point2.x, point2.y, colorR, colorG, colorB]);
    }

    dynamic createAxes(Vector3 origin, Vector3 length) {
        assert(_isValidLatLon(origin));
        var axes = _bridge.callMethod('createAxes', [origin.x, origin.y, origin.z, length.x, length.y, length.z]);
        return axes;
    }

    dynamic createBbox(Vector3 point1, Vector3 point2) {
        assert(_isValidLatLon(point1));
        assert(_isValidLatLon(point2));
        var prim = _bridge.callMethod('createBbox', [point1.x, point1.y, point1.z, point2.x, point2.y, point2.z]);
        return prim;
    }

    dynamic createLine(Vector3 point1, Vector3 point2, double colorR, double colorG, double colorB) {
        assert(_isValidLatLon(point1));
        assert(_isValidLatLon(point2));
        var prim =
                _bridge.callMethod('createLine', [point1.x, point1.y, point1.z, point2.x, point2.y, point2.z, colorR, colorG, colorB]);
        assert(prim != null);
        return prim;
    }

    dynamic createCloud(int numPoints, Float32List points, Float32List colors) {
        assert(numPoints >= 0);
        assert(points.length == numPoints * 3);
        assert(colors.length == numPoints * 4);

        var points2 = createFloat64Array(numPoints * 3);
        var colors2 = createUint8Array(numPoints * 4);
        for (int i = 0; i < numPoints; i++) {
            assert(_isValidLatLon(new Vector3(points[i * 3 + 0], points[i * 3 + 1], points[i * 3 + 2])));

            points2[i * 3 + 0] = points[i * 3 + 0];
            points2[i * 3 + 1] = points[i * 3 + 1];
            points2[i * 3 + 2] = points[i * 3 + 2];

            colors2[i * 4 + 0] = (colors[i * 4 + 0] * 255.0).toInt();
            colors2[i * 4 + 1] = (colors[i * 4 + 1] * 255.0).toInt();
            colors2[i * 4 + 2] = (colors[i * 4 + 2] * 255.0).toInt();
            colors2[i * 4 + 3] = (colors[i * 4 + 3] * 255.0).toInt();
        }
        var prim = _bridge.callMethod('createCloud', [numPoints, points2, colors2]);
        return prim;
    }

    void remove(dynamic primitive) {
        _bridge.callMethod('removePrimitive', [primitive]);
    }

    dynamic createLabel(String text, Vector3 point) {

        return _bridge.callMethod('createLabel', [text, point.x, point.y, point.z]);
    }
}