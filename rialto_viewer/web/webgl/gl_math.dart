part of rialto.viewer;

class GlMath {
    static Matrix4 makePerspective(double fieldOfViewInRadians, double aspect, double near, double far) {
        var f = tan(PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);
        var m = new Matrix4.zero();
        m[0] = f / aspect;
        m[5] = f;
        m[10] = (near + far) * rangeInv;
        m[11] = -1.0;
        m[14] = near * far * rangeInv * 2.0;
        return m;
    }


    static Matrix4 makeTranslation(double tx, double ty, double tz) {
        var m = new Matrix4.identity();
        m[12] = tx;
        m[13] = ty;
        m[14] = tz;
        return m;
    }

    static Matrix4 makeScale(double sx, double sy, double sz) {
        var m = new Matrix4.zero();
        m[0] = sx;
        m[5] = sy;
        m[10] = sz;
        m[15] = 1.0;
        return m;
    }

    static Matrix4 makeXRotation(angleInRadians) {
        var c = cos(angleInRadians);
        var s = sin(angleInRadians);
        var m = new Matrix4.identity();
        m[5] = c;
        m[6] = s;
        m[9] = -s;
        m[10] = c;
        return m;
    }

    static Matrix4 makeYRotation(angleInRadians) {
        var c = cos(angleInRadians);
        var s = sin(angleInRadians);
        var m = new Matrix4.identity();
        m[0] = c;
        m[2] = -s;
        m[8] = s;
        m[10] = c;
        return m;
    }

    static Matrix4 makeZRotation(angleInRadians) {
        var c = cos(angleInRadians);
        var s = sin(angleInRadians);
        var m = new Matrix4.identity();
        m[0] = c;
        m[1] = s;
        m[4] = -s;
        m[5] = c;
        return m;
    }

    static Matrix4 makeLookAt(Vector3 cameraPosition, Vector3 cameraFocusPosition, Vector3 upDirection) {
        Matrix4 viewMatrix = new Matrix4.zero();
        Vector3 z = cameraPosition - cameraFocusPosition;
        z.normalize();
        Vector3 x = upDirection.cross(z);
        x.normalize();
        Vector3 y = z.cross(x);
        y.normalize();
        //viewMatrix.setZero();
        viewMatrix.setEntry(0, 0, x.x);
        viewMatrix.setEntry(1, 0, x.y);
        viewMatrix.setEntry(2, 0, x.z);
        viewMatrix.setEntry(0, 1, y.x);
        viewMatrix.setEntry(1, 1, y.y);
        viewMatrix.setEntry(2, 1, y.z);
        viewMatrix.setEntry(0, 2, z.x);
        viewMatrix.setEntry(1, 2, z.y);
        viewMatrix.setEntry(2, 2, z.z);
//      viewMatrix.transpose();
        //    Vector3 rotatedEye = viewMatrix * -cameraPosition;
        viewMatrix.setEntry(0, 3, cameraPosition.x);
        viewMatrix.setEntry(1, 3, cameraPosition.y);
        viewMatrix.setEntry(2, 3, cameraPosition.z);
        viewMatrix.setEntry(3, 3, 1.0);
        return viewMatrix;
    }
}