// Copyright (c) 2014-2015, RadiantBlue Technologies, Inc.
// This file may only be used under the MIT-style
// license found in the accompanying LICENSE.txt file.


var CesiumBridge = function (element) {


    //---------------------------------------------------------------------------------------------
    //
    // ctor
    //
    //---------------------------------------------------------------------------------------------

    {
        var _proxy;

        Cesium.BingMapsApi.defaultKey = "ApI13eFfY6SbmvsWx0DbJ1p5C1CaoR54uFc7Bk_Z9Jimwo1SKwCezqvWCskESZaf";

        var options = {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            sceneMode : Cesium.SceneMode.SCENE3D,
            creditContainer: "creditContainer",
            imageProvider: null
        };

        this.viewer = new Cesium.Viewer(element, options);

        this.viewer.cesiumWidget.creditContainer.className = "";

        this.viewer.imageryLayers.removeAll();
    }


    //---------------------------------------------------------------------------------------------
    //
    // DrawHelper
    //
    //---------------------------------------------------------------------------------------------

    this.drawCircle = function(cb) {
        var scene = this.viewer.scene;

        var f = function(center, radius) {
            var material = Cesium.Material.fromType('Color');
            material.uniforms.color = new Cesium.Color(1.0, 1.0, 0.0, 0.10);
            var circle = new DrawHelper.CirclePrimitive({
                center: center,
                radius: radius,
                //material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
                material: material
            });
            scene.primitives.add(circle);
            circle.setEditable();

            if (cb) {
                var ellipsoid = scene.globe.ellipsoid;
                var cartographic = ellipsoid.cartesianToCartographic(center);
                var lon = Cesium.Math.toDegrees(cartographic.longitude);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var h = cartographic.height;
                cb(lon, lat, h, radius);
            }
        };

        this.drawHelper.startDrawingCircle({
            callback:f
        });
    }

    var flattenCartesianList = function(list) {
        var result = [];
        for (var i=0; i<list.length; i++) {
            result.push(list[i].x);
            result.push(list[i].y);
            result.push(list[i].z);
        }
        return result;
    }

    this.drawPolyline = function(cb) {
        var scene = this.viewer.scene;

        var f = function (positions) {
            var polyline = new DrawHelper.PolylinePrimitive({
                positions: positions,
                width: 5,
                geodesic: true
            });
            scene.primitives.add(polyline);
            polyline.setEditable();

            if (cb) {
                var p = flattenCartesianList(positions);
                cb(p);
            }
        };

        this.drawHelper.startDrawingPolyline({
            callback:f
        });
    }

    this.drawPolygon = function(cb) {
        var scene = this.viewer.scene;

        var f = function (positions) {
             var polygon = new DrawHelper.PolygonPrimitive({
                positions: positions,
                material : Cesium.Material.fromType('Checkerboard')
            });
            scene.primitives.add(polygon);
            polygon.setEditable();

            if (cb) {
                var p = flattenCartesianList(positions);
                cb(p);
            }
        };

        this.drawHelper.startDrawingPolygon({
            callback:f
        });
    }

    this.drawMarker = function(cb) {
        var scene = this.viewer.scene;

        var f = function (position) {
            var b = new Cesium.BillboardCollection();
            scene.primitives.add(b);
            var billboard = b.add({
                show : true,
                position : position,
                pixelOffset : new Cesium.Cartesian2(0, 0),
                eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.CENTER,
                scale : 1.0,
                image: './img/glyphicons_242_google_maps.png',
                color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            billboard.setEditable();

            if (cb) {
                cb(position);
            }
        };

        this.drawHelper.startDrawingMarker({
            callback:f
        });
    }

    this.drawExtent = function(cb) {
        var scene = this.viewer.scene;

        var f = function (extent) {
            var extentPrimitive = new DrawHelper.ExtentPrimitive({
                extent: extent,
                material: Cesium.Material.fromType(Cesium.Material.StripeType)
            });
            scene.primitives.add(extentPrimitive);
            extentPrimitive.setEditable();

            if (cb) {
                cb(extent.north, extent.south, extent.east, extent.west);
            }
        };

        this.drawHelper.startDrawingExtent({
            callback:f
        });
    }


    this.createDrawHelper = function (element) {
        var scene = this.viewer.scene;

        var loggingMessage = mylog;

        this.drawHelper = new DrawHelper(scene, element);
    }


    //---------------------------------------------------------------------------------------------
    //
    // utils
    //
    //---------------------------------------------------------------------------------------------

    this.createProxy = function (url) {
        _proxy = new Object();
        _proxy._url = url;
        _proxy.getURL = function (resource) {
            return _proxy._url + '?' + encodeURIComponent(resource);
        }

        return _proxy;
    }


    this.newRectangleFromDegrees = function (w, s, e, n) {
        var rect = new Cesium.Rectangle.fromDegrees(w, s, e, n);
        return rect;
    }


    this.cartographicDistance = function(lon1, lat1, lon2, lat2) {
        var p = Cesium.Cartesian3.fromDegrees(lon1, lat1);
        var q = Cesium.Cartesian3.fromDegrees(lon2, lat2);
        var radius = Cesium.Cartesian3.distance(p, q);
        return radius;
    }


    //---------------------------------------------------------------------------------------------
    //
    // imagery provider utils
    //
    //---------------------------------------------------------------------------------------------

    this.setLayerVisible = function (layer, v) {
        layer.show = v;
    }

    this.setLayerAlpha = function (layer, d) {
        layer.alpha = d;
    }

    this.setLayerBrightness = function (layer, d) {
        layer.brightness = d;
    }

    this.setLayerContrast = function (layer, d) {
        layer.contrast = d;
    }

    this.setLayerHue = function (layer, d) {
        layer.hue = d;
    }

    this.setLayerSaturation = function (layer, d) {
        layer.saturation = d;
    }

    this.setLayerGamma = function (layer, d) {
        layer.gamma = d;
    }


    //---------------------------------------------------------------------------------------------
    //
    // Imagery Providers
    //
    //---------------------------------------------------------------------------------------------

    this.addSingleTileImageryLayer = function (url, rect, proxy) {
        var options = {
            url: url,
            rectangle: rect == null ? undefined : rect,
            proxy: proxy == null ? undefined : proxy
        };
        var provider = Cesium.SingleTileImageryProvider(options);
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }


    this.addWebMapServiceImageryLayer = function (url, layers, rect, proxy) {
        var options = {
            url: url,
            layers: layers,
            rectangle: rect == null ? undefined : rect,
            proxy: proxy == null ? undefined : proxy
        };
        myassert(proxy != null);
        var provider = new Cesium.WebMapServiceImageryProvider(options);
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }


    this.addTileMapServiceImageryLayer = function(url, rect, maximumLevel, gdal2Tiles, proxy) {

        var options = {
            url: url,
            rectangle: rect == null ? undefined : rect,
            maximumLevel: maximumLevel,
            proxy: proxy == null ? undefined : proxy,
            gdal2Tiles: gdal2Tiles
        };
        var provider = new Cesium.TileMapServiceImageryProvider(options);
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    this.removeImageryLayer = function(layer) {
        this.viewer.imageryLayers.remove(layer);
    }

    //---------------------------------------------------------------------------------------------
    //
    // Terrain Providers
    //
    //---------------------------------------------------------------------------------------------


    this.setCesiumTerrainProvider = function (options) {
        var provider = new Cesium.CesiumTerrainProvider(options);
        this.viewer.terrainProvider = provider;
        return provider;
    }


    this.setEllipsoidBaseTerrainProvider = function (options) {
        var provider = new Cesium.EllipsoidTerrainProvider(options);
        this.viewer.terrainProvider = provider;
        return provider;
    }


    this.setVrTheWorldBaseTerrainProvider = function (options) {
        var provider = new Cesium.VRTheWorldTerrainProvider(options);
        this.viewer.terrainProvider = provider;
        return provider;
    }


    this.setCesiumBaseTerrainProvider = function (options) {
        var provider = new Cesium.CesiumTerrainProvider(options);
        this.viewer.terrainProvider = provider;
        return provider;
    }


    this.setArcGisBaseTerrainProvider = function (options) {
        var provider = new Cesium.ArcGisImageServerTerrainProvider(options);
        this.viewer.terrainProvider = provider;
        return provider;
    }

    this.unsetBaseTerrainProvider = function () {
        this.viewer.terrainProvider = null;
    }

    this.unsetTerrainProvider = function () {
        this.viewer.terrainProvider = null;
    }


    //---------------------------------------------------------------------------------------------
    //
    // Base Imagery Providers
    //
    //---------------------------------------------------------------------------------------------


    this.setBingBaseImageryProvider = function(options) {
        var provider = new Cesium.BingMapsImageryProvider(options);
        var layer = this.viewer.imageryLayers.addImageryProvider(provider);
        return layer;
    }


    this.setOsmBaseImageryProvider = function(options) {
        var provider = new Cesium.OpenStreetMapImageryProvider(options);
        var layer = this.viewer.imageryLayers.addImageryProvider(provider);
        return layer;
    }


    this.setArcGisBaseImageryProvider = function(options) {
        var provider = new Cesium.ArcGisMapServerImageryProvider(options);
        var layer = this.viewer.imageryLayers.addImageryProvider(provider);
        return layer;
    }


    //---------------------------------------------------------------------------------------------
    //
    // point cloud support
    //
    //---------------------------------------------------------------------------------------------


    // returns a promise<provider>
    this._createTileProvider2Async = function(urlarg, colorizeRamp, colorizeDimension, visible) {
        var deferred = Cesium.when.defer();

        var provider = new PointCloudProvider(urlarg, colorizeRamp, colorizeDimension, visible);

        provider.readHeaderAsync().then(function(header) {
            deferred.resolve(provider);
        }).otherwise(function (error) {
            myerror("Unable to read point cloud header: " + urlarg, error);
        });

        return deferred.promise;
    }


    // returns nothing, but sets the completer<promise>
    this.createTileProviderAsync = function(urlarg, colorizeRamp, colorizeDimension, visible, completer) {

        var thisthis = this;

        this._createTileProvider2Async(urlarg, colorizeRamp, colorizeDimension, visible).then(function(provider) {

            var viewer = thisthis.viewer;
            var scene = viewer.scene;
            var primitives = scene.primitives;

            primitives.add(new Cesium.QuadtreePrimitive({
                tileProvider : provider
            }));

            //mylog("----------" + provider.header.numPoints);

            completer(provider);
            return;

        }).otherwise(function (error) {
            myerror("Unable to create point cloud tile provider", error);
        });
    }


    this.unloadTileProvider = function(provider) {

        var viewer = this.viewer;
        var scene = viewer.scene;
        var primitives = scene.primitives;

        primitives.remove(provider.quadtree);
    }


    this.getDimensionNamesFromProvider = function (provider) {
        var ret = [];

        var dims = provider.header.dimensions;
        for (var i=0; i<dims.length; i++) {
            ret.push(dims[i].name);
        }

        return ret;
    }


    this.getNumPointsFromProvider = function (provider) {
        var n = provider.header.numPoints;
        return n;
    }


    this.getTileBboxFromProvider = function (provider) {
        var b = provider.header.tilebbox;
        return b;
    }


    this.getStatsFromProvider = function (provider, dimName) {
        var dims = provider.header.dimensions;
        for (var i=0; i<dims.length; i++) {
            if (dims[i].name == dimName) {
                var list = [dims[i].min, dims[i].mean, dims[i].max];
                return list;
            }
        }

        return null;
    }


    this.getColorRampNames = function () {
        var keys = Object.keys(colorRamps);
        return keys;
    }


    //---------------------------------------------------------------------------------------------
    //
    // GeoJSON support
    //
    //---------------------------------------------------------------------------------------------


    this.addDataSource = function (dataSource) {
        this.viewer.dataSources.add(dataSource);
    }


    this.removeDataSource = function (dataSource) {
        this.viewer.dataSources.remove(dataSource);
    }

    this.setDataSourceVisible = function (dataSource, v) {
        var list = this.viewer.dataSources;

        // TODO: there should be a better way to do this, using the "show" property?
        if (v) {
            if (!list.contains(dataSource)) {
                list.add(dataSource);
            }
        } else {
            if (list.contains(dataSource)) {
                list.remove(dataSource);
            }
        }
    }

    this.addGeoJsonDataSource = function(name, url, completer) {
        var viewer = this.viewer;

        var ds = new Cesium.GeoJsonDataSource(name);
        viewer.dataSources.add(ds);

        // these are default styling settings, if no simplestyle present
        ds.loadUrl(url, {
          stroke: Cesium.Color.WHITE,
          fill: Cesium.Color.WHITE,
          strokeWidth: 1,
          markerSymbol: '*'
        }).then(function() {
            completer(ds);
        }).otherwise(function (error) {
            myerror("Unable to read geojson: " + urlarg, error);
        });
    }


    //---------------------------------------------------------------------------------------------
    //
    // primitives support
    //
    //---------------------------------------------------------------------------------------------


    this.isPrimitiveVisible = function(primitive) {
        return primitive.show;
    }


    this.setPrimitiveVisible = function(primitive, value) {
        primitive.show = value;
    }


    this.removePrimitive = function(prim) {
        var scene = this.viewer.scene;
        var primitives = scene.primitives;
        primitives.remove(prim);
    }

    this._createLineInstance = function(x0, y0, z0, x1, y1, z1, color) {
        var p1 = Cesium.Cartesian3.fromDegrees(x0, y0, z0);
        var p2 = Cesium.Cartesian3.fromDegrees(x1, y1, z1);
        var vertices = [p1, p2];
        var geom = new Cesium.PolylineGeometry({
            positions : vertices,
            width : 1.0,
            vertexFormat : Cesium.PolylineColorAppearance.VERTEX_FORMAT,
            followSurface: true
        });

        var instance = new Cesium.GeometryInstance({
            geometry : geom,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
            }
        });

        return instance;
    }

    this.createBbox = function(x0, y0, z0, x1, y1, z1) {
        var red1 = this._createLineInstance(x0, y0, z0, x1, y0, z0, Cesium.Color.RED);
        var red2 = this._createLineInstance(x0, y1, z0, x1, y1, z0, Cesium.Color.RED);
        var red3 = this._createLineInstance(x0, y0, z1, x1, y0, z1, Cesium.Color.RED);
        var red4 = this._createLineInstance(x0, y1, z1, x1, y1, z1, Cesium.Color.RED);

        var green1 = this._createLineInstance(x0, y0, z0, x0, y1, z0, Cesium.Color.GREEN);
        var green2 = this._createLineInstance(x1, y0, z0, x1, y1, z0, Cesium.Color.GREEN);
        var green3 = this._createLineInstance(x0, y0, z1, x0, y1, z1, Cesium.Color.GREEN);
        var green4 = this._createLineInstance(x1, y0, z1, x1, y1, z1, Cesium.Color.GREEN);

        var blue1 = this._createLineInstance(x0, y0, z0, x0, y0, z1, Cesium.Color.BLUE);
        var blue2 = this._createLineInstance(x1, y0, z0, x1, y0, z1, Cesium.Color.BLUE);
        var blue3 = this._createLineInstance(x0, y1, z0, x0, y1, z1, Cesium.Color.BLUE);
        var blue4 = this._createLineInstance(x1, y1, z0, x1, y1, z1, Cesium.Color.BLUE);

        var prim = new Cesium.Primitive({
            geometryInstances : [red1, red2, red3, red4,
                                 green1, green2, green3, green4,
                                 blue1, blue2, blue3, blue4],
            appearance : new Cesium.PolylineColorAppearance()
        });
        this.viewer.scene.primitives.add(prim);
        //prim.show = false;
        return prim;
    }


    //---------------------------------------------------------------------------------------------
    //
    // mouse
    //
    //---------------------------------------------------------------------------------------------


    this.onMouseMove = function(f) {
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(

            function(event) {
                var windowX = event.endPosition.x;
                var windowY = event.endPosition.y;
                f(windowX,windowY);
            },

            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
    }


    this.onMouseDown = function(f) {
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(
            function(event) {
                var windowX = event.position.x;
                var windowY = event.position.y;
                f(windowX, windowY, 0);
            },
            Cesium.ScreenSpaceEventType.LEFT_DOWN
        );
        handler.setInputAction(
            function(event) {
                var windowX = event.position.x;
                var windowY = event.position.y;
                f(windowX, windowY, 1);
            },
            Cesium.ScreenSpaceEventType.MIDDLE_DOWN
        );
        handler.setInputAction(
            function(event) {
                var windowX = event.position.x;
                var windowY = event.position.y;
                f(windowX, windowY, 2);
            },
            Cesium.ScreenSpaceEventType.RIGHT_DOWN
        );
    }


    this.onMouseUp = function(f) {
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(
            function(event) {
                var windowX = event.position.x;
                var windowY = event.position.y;
                f(windowX, windowY, 0);
            },
            Cesium.ScreenSpaceEventType.LEFT_UP
        );
        handler.setInputAction(
            function(event) {
                var windowX = event.position.x;
                var windowY = event.position.y;
                f(windowX, windowY, 1);
            },
            Cesium.ScreenSpaceEventType.MIDDLE_UP
        );
        handler.setInputAction(
            function(event) {
                var windowX = event.position.x;
                var windowY = event.position.y;
                f(windowX, windowY, 2);
            },
            Cesium.ScreenSpaceEventType.RIGHT_UP
        );
    }


    this.onMouseWheel = function(f) {
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(
            function(delta) {
                f(delta);
            },
            Cesium.ScreenSpaceEventType.WHEEL
        );
    }


    // returns triplet of cartographic degrees as doubles
    this.getMouseCoords = function(windowX, windowY) {
        var pt2 = new Cesium.Cartesian2(windowX, windowY);
        var ellipsoid = this.viewer.scene.globe.ellipsoid;
        var cartesian = this.viewer.camera.pickEllipsoid(pt2, ellipsoid);
        if (cartesian) {
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            var lon = Cesium.Math.toDegrees(cartographic.longitude);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var h = cartographic.height;
            return [lon, lat, h];
        } else {
            return null;
        }
    }


    //---------------------------------------------------------------------------------------------
    //
    // Home & view modes
    //
    //---------------------------------------------------------------------------------------------


    // 0=3D, 1=2.5D, 2=2D
    this.setViewMode = function(m) {

        var scene = this.viewer.scene;
        var sec = 0.5;

        if (m == 0) {
            scene.morphTo2D(sec);
        } else if (m == 1) {
            scene.morphToColumbusView(sec);
        } else if (m == 2) {
            scene.morphTo3D(sec);
        } else {
            myassert(false, "bad scene mode value");
        }
    }


    // taken from HomeButtonView.viewHome
    this.goHome = function() {
        var scene = this.viewer.scene;
        var mode = scene.mode;

        if (Cesium.defined(scene) && mode === Cesium.SceneMode.MORPHING) {
            scene.completeMorph();
        }

        var direction;
        var right;
        var up;

        if (mode === Cesium.SceneMode.SCENE2D) {
            scene.camera.flyToRectangle({
                destination : Cesium.Rectangle.MAX_VALUE,
                duration : 0,
                endTransform : Cesium.Matrix4.IDENTITY
            });
        } else if (mode === Cesium.SceneMode.SCENE3D) {
            var destination = scene.camera.getRectangleCameraCoordinates(Cesium.Camera.DEFAULT_VIEW_RECTANGLE);
            var mag = Cesium.Cartesian3.magnitude(destination);
            mag += mag * Cesium.Camera.DEFAULT_VIEW_FACTOR;
            Cesium.Cartesian3.normalize(destination, destination);
            Cesium.Cartesian3.multiplyByScalar(destination, mag, destination);

            direction = Cesium.Cartesian3.normalize(destination, new Cesium.Cartesian3());
            Cesium.Cartesian3.negate(direction, direction);
            right = Cesium.Cartesian3.cross(direction, Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3());
            up = Cesium.Cartesian3.cross(right, direction, new Cesium.Cartesian3());

            scene.camera.flyTo({
                destination : destination,
                direction: direction,
                up : up,
                duration : 0,
                endTransform : Cesium.Matrix4.IDENTITY
            });
        } else if (mode === Cesium.SceneMode.COLUMBUS_VIEW) {
            var maxRadii = scene.globe.ellipsoid.maximumRadius;
            var position = new Cesium.Cartesian3(0.0, -1.0, 1.0);
            position = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.normalize(position, position), 5.0 * maxRadii, position);
            direction = new Cesium.Cartesian3();
            direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(Cesium.Cartesian3.ZERO, position, direction), direction);
            right = Cesium.Cartesian3.cross(direction, Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3());
            up = Cesium.Cartesian3.cross(right, direction, new Cesium.Cartesian3());

            scene.camera.flyTo({
                destination : position,
                duration : 0,
                up : up,
                direction : direction,
                endTransform : Cesium.Matrix4.IDENTITY,
                convert : false
            });
        }
    }


    // input: cartographic, height in meters
    this.lookAtCartographic = function(eyeLon, eyeLat, eyeHeight,
                                       targetLon, targetLat, targetHeight,
                                       upX, upY, upZ, fovDegrees) {
        var scene = this.viewer.scene;
        var mode = scene.mode;

        if (Cesium.defined(scene) && mode === Cesium.SceneMode.MORPHING) {
            scene.completeMorph();
        }

        if (mode === Cesium.SceneMode.SCENE2D ||
            mode == Cesium.SceneMode.COLUMBUS_VIEW) {
            // TODO: hack fix for now
            this.goHome();
            return;
        }

        var ellipsoid = scene.globe.ellipsoid;

        var eyeCartographic = Cesium.Cartographic.fromDegrees(eyeLon, eyeLat, eyeHeight);
        var targetCartographic = Cesium.Cartographic.fromDegrees(targetLon, targetLat, targetHeight);
        var eyeCartesian = ellipsoid.cartographicToCartesian(eyeCartographic);
        var targetCartesian = ellipsoid.cartographicToCartesian(targetCartographic);

        //mylog("eye cartesian: " + eyeCartesian.x + ", " + eyeCartesian.y + ", " + eyeCartesian.z);
        //mylog("target cartesian: " + targetCartesian.x + ", " + targetCartesian.y + ", " + targetCartesian.z);

        var up = new Cesium.Cartesian3(upX, upY, upZ);

        // we only support PerspectiveFrustum camera, so seeting FOV is okay
        this.viewer.camera.frustum.fov = Cesium.Math.toRadians(fovDegrees);

        this.viewer.camera.lookAt(eyeCartesian, targetCartesian, up);
    }
}
