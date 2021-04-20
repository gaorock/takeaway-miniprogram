<view class="menu-wrapper" wx:if="{{tabIndex === 0}}" >
        <!-- menu left -->
        <scroll-view class="menu-left-wrapper" scroll-y="true">
          <view wx:for="{{catelist}}" class="menu-left-item {{item.id === menuID?'active':''}}" 
                bind:tap="changeMenuIndex" wx:key="id" data-id="{{item.id}}" scroll-into-view="{{leftViewIndex}}">
            {{item.name}} 
          </view>
          <view class="placeholder"></view>
        </scroll-view>
        <!-- menu right -->
        <scroll-view class="menu-right-wrapper right-menu" scroll-y enhanced="{{true}}" show-scrollbar="{{false}}"
          scroll-into-view="{{rightViewIndex}}" scroll-with-animation id="right-menu" bind:scroll="onRightScroll">
          <!-- cate Big box -->
          <view wx:for="{{products}}" wx:key="id" wx:for-item="cate" data-xx="{{cate.id}}" class="cate{{cate.id}} right-cate-bar" id="cate{{cate.id}}">
            <!-- every Goods in cate -->
            <view wx:for="{{cate.goods}}" wx:key="id" class="menu-right-item" wx:for-item="prod">
              <image src="{{prod.thumbnail}}" mode="aspectFill" class="menu-item-image"/>
              <view class="menu-item-info"> 
                <view>
                  <view class="item-title">{{prod.post_title}}</view>
                  <text wx:for="{{prod.tag}}" wx:key="index" class="item-cates">{{item.name}}</text>
                </view>
                <view class="item-lower-wrapper">
                  <view class="item-repe">
                    <view class="item-sale">月售{{prod.sales}}</view>
                    <view>
                      <text class="item-money-sign">¥</text>
                      <text class="item-price-yan">{{prod.yan}}</text>
                      <text class="item-price-fen">{{prod.fen}}</text>
                      <text class="item-unit" wx:if="{{prod.unit}}">/{{prod.unit}}</text>
                    </view>
                  </view>
                  <view class="item-button">
                    <view wx:if="{{prod.multi}}" 
                    class="item-button-multi" 
                    bind:tap="openMultiSelect"
                    data-id="{{prod.id}}">多规格</view>

                    <Amount wx:else 
                    amount="{{cartItem[prod.id]['normal']}}"
                    bind:tap="onAmountChange" 
                    data-id="{{prod.id}}" 
                    data-spec="normal"/>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="placeholder"></view>
        </scroll-view>
      </view>