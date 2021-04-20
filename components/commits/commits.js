const fetch = require('../../utils/fetch');
const {getCommitsUrl} = require('../../utils/api');
// components/commits/commits.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    commits: [],
    width: 0,
  },

  lifetimes: {
    async attached () {
      // fetch commits data from server
      const commits = await fetch(`${getCommitsUrl}?page=1`);
      if (commits.code === 1) {
        this.setData({ commits: commits.data.data})
        this._pageNum = parseInt(commits.data.current_page);
        this._totalPage = parseInt(commits.data.last_page);
      }

      // console.log({_pageNum: this._pageNum, _totalPage: this._totalPage})
      

      this.createSelectorQuery().select('.commits-content').boundingClientRect(rect => {
        const width = (rect.width - 10) / 3 * 2;
        this.setData({width})
      }).exec()
    },

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async loadmore () {
      if (this._pageNum === this._totalPage) return;
      // fetch commits data from server
      const commits = await fetch(`${getCommitsUrl}?page=${this._pageNum+1}`);
      if (commits.code === 1) {
        this._pageNum = parseInt(commits.data.current_page);
        const content = [...this.data.commits, ...commits.data.data]
        this.setData({ commits: content})
      }
    },
  }
})
