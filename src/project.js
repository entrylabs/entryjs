'use strict';

Entry.getStartProject = function(mediaFilePath) {

  return {
    "category" : "기타",
    "scenes" : [
        {
            "name" : "장면 1",
            "id" : "7dwq"
        }
    ],
    "variables" : [
        {
            "name" : "초시계",
            "id" : "brih",
            "visible" : false,
            "value" : "0",
            "variableType" : "timer",
            "x" : 150,
            "y" : -70,
            "array" : [],
            "object" : null,
            "isCloud" : false
        },
        {
            "name" : "대답",
            "id" : "1vu8",
            "visible" : false,
            "value" : "0",
            "variableType" : "answer",
            "x" : 150,
            "y" : -100,
            "array" : [],
            "object" : null,
            "isCloud" : false
        }
    ],
    "objects" : [
        {
            "id" : "7y0y",
            "name" : "엔트리봇",
            "script" : "<xml><block type=\"when_run_button_click\" x=\"136\" y=\"47\"><next><block type=\"repeat_basic\"><value name=\"VALUE\"><block type=\"number\"><field name=\"NUM\">10</field></block></value><statement name=\"DO\"><block type=\"move_direction\"><value name=\"VALUE\"><block type=\"number\"><field name=\"NUM\">10</field></block></value></block></statement></block></next></block></xml>",
            "selectedPictureId" : "vx80",
            "objectType" : "sprite",
            "rotateMethod" : "free",
            "scene" : "7dwq",
            "sprite" : {
                "sounds" : [
                    {
                        "duration" : 1.3000000000000000,
                        "ext" : ".mp3",
                        "id" : "8el5",
                        "fileurl" : mediaFilePath + "media/bark.mp3",
                        "name" : "강아지 짖는소리"
                    }
                ],
                "pictures" : [
                    {
                        "id" : "vx80",
                        "fileurl" : mediaFilePath + "media/entrybot1.png",
                        "name" : "엔트리봇_걷기1",
                        "scale" : 100,
                        "dimension" : {
                            "width" : 284,
                            "height" : 350
                        }
                    },
                    {
                        "id" : "4t48",
                        "fileurl" : mediaFilePath + "media/entrybot2.png",
                        "name" : "엔트리봇_걷기2",
                        "scale" : 100,
                        "dimension" : {
                            "width" : 284,
                            "height" : 350
                        }
                    }
                ]
            },
            "entity" : {
                "x" : 0,
                "y" : 0,
                "regX" : 142,
                "regY" : 175,
                "scaleX" : 0.3154574132492113,
                "scaleY" : 0.3154574132492113,
                "rotation" : 0,
                "direction" : 90,
                "width" : 284,
                "height" : 350,
                "visible" : true
            },
            "lock" : false,
            "active" : true
        }
    ],
    "speed" : 60
  }

};
