import React from "react"
import EXIF from "exif-js"
import styles from "./Upload.css"

export default class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /** 文件变化 */
  fileChange(e) {
    console.log(e.target.files)
    let files = e.target.files
    let oReader = new FileReader()
    let file = files[0]
    let Orientation = null
    let fileName = e.target.files[0].name
    let that = this

    //获取照片方向角属性，用户旋转控制
    EXIF.getData(file, function() {
      EXIF.getAllTags(this)
      Orientation = EXIF.getTag(this, "Orientation")
    })

    oReader.readAsDataURL(file)
    oReader.onload = function(e) {
      let image = new Image()
      image.src = e.target.result
      image.onload = function() {
        let expectWidth = this.naturalWidth
        let expectHeight = this.naturalHeight

        let canvas = document.createElement("canvas")
        let ctx = canvas.getContext("2d")
        canvas.width = expectWidth
        canvas.height = expectHeight
        ctx.drawImage(this, 0, 0, expectWidth, expectHeight)
        let base64 = null
        //修复ios
        if (navigator.userAgent.match(/iphone/i)) {
          //如果方向角不为1，都需要进行旋转 added by lzk
          if (Orientation != "" && Orientation != 1) {
            switch (Orientation) {
              case 6: //需要顺时针（向左）90度旋转
                that.rotateImg(this, "left", canvas)
                break
              case 8: //需要逆时针（向右）90度旋转
                that.rotateImg(this, "right", canvas)
                break
              case 3: //需要180度旋转  //转两次
                that.rotateImg(this, "right", canvas)
                that.rotateImg(this, "right", canvas)
                break
            }
          }
          base64 = canvas.toDataURL("image/jpeg", 0.1)
        } else if (navigator.userAgent.match(/Android/i)) {
          // 修复android

          if (Orientation != "" && Orientation != 1) {
            switch (Orientation) {
              case 6: //需要顺时针（向左）90度旋转
                that.rotateImg(this, "left", canvas)
                break
              case 8: //需要逆时针（向右）90度旋转
                that.rotateImg(this, "right", canvas)
                break
              case 3: //需要180度旋转 //转两次
                that.rotateImg(this, "right", canvas)
                that.rotateImg(this, "right", canvas)
                break
            }
          }
          base64 = canvas.toDataURL("image/jpeg", 0.1)
        } else {
          if (Orientation != "" && Orientation != 1) {
            switch (Orientation) {
              case 6: //需要顺时针（向左）90度旋转
                that.rotateImg(this, "left", canvas)
                break
              case 8: //需要逆时针（向右）90度旋转
                that.rotateImg(this, "right", canvas)
                break
              case 3: //需要180度旋转 //转两次
                that.rotateImg(this, "right", canvas)
                that.rotateImg(this, "right", canvas)
                break
            }
          }
          base64 = canvas.toDataURL("image/jpeg", 0.1)
        }
        let newFile = that.dataURLtoFile(base64, fileName)
        let results = {
          base64,
          file: newFile
        }

        console.log(results)
      }
    }
  }

  //对图片旋转处理
  rotateImg(img, direction, canvas) {
    //最小与最大旋转方向，图片旋转4次后回到原方向
    let min_step = 0
    let max_step = 3
    if (img == null) return
    let height = img.height
    let width = img.width
    let step = 2
    if (step == null) {
      step = min_step
    }
    if (direction == "right") {
      step++
      //旋转到原位置，即超过最大值
      step > max_step && (step = min_step)
    } else {
      step--
      step < min_step && (step = max_step)
    }
    //旋转角度以弧度值为参数
    let degree = (step * 90 * Math.PI) / 180
    let ctx = canvas.getContext("2d")
    switch (step) {
      case 0:
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0)
        break
      case 1:
        canvas.width = height
        canvas.height = width
        ctx.rotate(degree)
        ctx.drawImage(img, 0, -height)
        break
      case 2:
        canvas.width = width
        canvas.height = height
        ctx.rotate(degree)
        ctx.drawImage(img, -width, -height)
        break
      case 3:
        canvas.width = height
        canvas.height = width
        ctx.rotate(degree)
        ctx.drawImage(img, -width, 0)
        break
    }
  }

  /** base64转换file对象 */
  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(",")
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    //转换成file对象
    return new File([u8arr], filename, { type: mime })
  }

  render() {
    return (
      <div>
        <div className={styles.add_box}>
          <i className="iconfont iconicon_add" />
          <input
            type="file"
            accept="image/*"
            className={styles.real_upload}
            onChange={this.fileChange.bind(this)}
          />
        </div>
      </div>
    )
  }
}
