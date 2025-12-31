---
title: Oracle(预言机)
---

# 预言机(Oracle)

```jsx
什么是预言机？
```

预言机是指数据馈送，它提取区块链数据源（下链）的数据并将数据存放到区块链（上链）上供智能合约使用。因为运行在以太坊上的智能合约无法访问存储在区块链网络之外的信息，预言机是必不可上的。

预言的意思（Oracle）是指古希腊神话中的神谕，由神或者女祭司发表的预言或指示，因此，这里将外部数据引入区块链的机制被称为 Oracle，即预言机

预言机赋予了智能合约使用链下数据输入执行的能力，扩展了去中心化应用的价值，例如，去中心化预测市场依靠预言机提供的关于结果的信息，并且能够使用这些信息验证用户的预测。假设 A 下注了 20 个以太币赌谁将成为下一任美国总统，这种情况，链上的数据中是没有关于下一任总统的信息的，预测市场去中心化应用程序需要预言机来确认选举结果，并判定 A 是否有资格获得赌注

区块链预言机获取验证外部信息（即存储在链下的信息）并将外部信息传送给区块链上运行的智能合约的应用程序。除了拉取链下数据用户并在以太坊进行广播之外，预言机还将信息从区块链推送到外部系统，用户通过以太坊交易发送费用后解锁智能锁的预言机就是一个推送信息的示例。

预言机充当了一座桥梁，链接区块链上的智能合约与链下数据提供者，如果没有预言机，智能合约智能访问链上的数据，预言机提供了一种使用链下数据处罚智能合约的功能机制。

预言机的分类：

- 数据来源（一种或多种）
- 信任模型（中心化/去中心化）
- 系统架构（立即读取或发布订阅）
- 是否检索外部数据供链上合约使用（输入预言机）
- 是否将区块量的信息发送给链下应用程序（输出预言机）
- 在链下执行计算任务（计算预言机）

## 预言机解决了什么问题

智能合约不仅仅只是作为区块链特定地址运行的代码段，更广义来说，智能合约是指满足特定条件后能够执行各方之间协议的**自执行软件程序**

但是问题也在于此，因为以太坊是确定性系统，确定性系统是指在给定初始状态和特定输入时总是产生相同结果的系统，即在使用输入计算输出的过程中不存在随机性和变化

要实现确定性执行，区块链节点限制为通过仅使用存储在区块链本身中的数据就简单的二进制(true/false)问题达成共识，这类问题的示例包括：

- 账户所有者（由公钥识别）是否使用配对私钥签署该交易
- 该账户是否有足够资金支付这笔交易
- 这笔交易在该智能合约中是否有效

如果区块链从外部来源（现实世界）接受信息，确定性将不可能实现，阻止节点就区块链状态变化的有效性达成一致，以一个智能合约为例，该合约根据从一个传统价格应用程序接口获得的当前的以太币-美元（ETH/USDT）汇率窒执行交易。该汇率会经常变动，甚至会被弃用会黑客攻击，这意味着执行相同合约代码的节点会得出不同的结果

全球会数千个节点处理交易的公共区块链，如以太坊，确定性至关重要，由于没有中心化阻止作为真实性来源，期望节点在进行相同交易后达到相同状态。节点 A 执行智能合约的代码得到结果“3”，而 B 节点运行相同交易后得到“7”，这将打破共识并消除以太坊作为去中心化计算平台的价值。

以上就是**区块链从外部来源获取信息的问题**

预言机解决了这一问题，它从链下来源获取信息并存储在区块链上供智能合约使用。由于存储在链上的信息是不可更改和公共可用的，以太坊节点可以安全地使用预言机导入的链下数据计算状态变化。

为此，预言机通常由链上运行的智能合约和一些链下组件构成。链上合约接收其他智能合约的数据请求，并将这些请求传送给链下组件（称为预言机节点）。这类预言机节点可以查询数据源-例如使用 API 并发送交易将请求的数据存储在智能合约的存储中。

总结就是：预言机弥合了区块链和外部环境（如真实世界）的信息缺口，创建了混合智能合约，原理是基于链上合约代码和链下基础设施的结合。

## 什么是预言机问题

如何依赖一个实体或多个实体向区块链引入外部信息（即将信息存储在交易的数据有效负载中），智能合约很容易获取链下数据，但是会有新的问题：

- 如何验证注入信息是从正确来源提取的或者未被篡改
- 如何确保这些数据始终可用且定期更新。

重要的是确保来自预言机的数据是正确的，否则智能合约执行会产生错误结果，这是一个**信任**问题

不同的预言机在解决预言机问题方面采取的方法各不相同，只需要满足以下几点的中几个即可：

- **正确性**：预言机不应导致智能合约基于无效的链下数据触发状态变化。因此，预言机必须保证数据的真实性和完整性-真实性是指数据从正确来源获取，完整性是指数据在发送到链上前保持完好无缺。
- **可用性**：预言机不应延迟或阻止智能合约执行操作或触发状态变化，该特点要求预言机提供的数据在请求时可用并且不会出现间断。
- 激励兼容性：预言机激励链下数据提供者向智能合约提交正确的信息。包括可归因性和问责性，可归因性允许将一条外部信息与其提供者关联起来，问责性指的是数据提供者与提供的信息绑定，这样就可以根据所提供信息的质量对他们进行奖励或惩罚。

## 预言机合约

预言机合约是预言机服务的链上组成部分，它侦听其他合约发出的数据请求，将数据查询转发到预言机及诶单并将返回的数据向客户端合约广播，该合约还可以对返回的数据点进行一些计算，以产生聚合值并发送给请求合约。

以下是合约示例

```jsx
pragma solidity >=0.4.21 <0.6.0;

contract Oracle {
  Request[] requests; //list of requests made to the contract
  uint currentId = 0; //increasing request id
  uint minQuorum = 2; //minimum number of responses to receive before declaring final result
  uint totalOracleCount = 3; // Hardcoded oracle count

  // defines a general api request
  struct Request {
    uint id;                            //request id
    string urlToQuery;                  //API url
    string attributeToFetch;            //json attribute (key) to retrieve in the response
    string agreedValue;                 //value from key
    mapping(uint => string) answers;     //answers provided by the oracles
    mapping(address => uint) quorum;    //oracles which will query the answer (1=oracle hasn't voted, 2=oracle has voted)
  }

  //event that triggers oracle outside of the blockchain
  event NewRequest (
    uint id,
    string urlToQuery,
    string attributeToFetch
  );

  //triggered when there's a consensus on the final result
  event UpdatedRequest (
    uint id,
    string urlToQuery,
    string attributeToFetch,
    string agreedValue
  );

  function createRequest (
    string memory _urlToQuery,
    string memory _attributeToFetch
  )
  public
  {
    uint length = requests.push(Request(currentId, _urlToQuery, _attributeToFetch, ""));
    Request storage r = requests[length-1];

    // Hardcoded oracles address
    r.quorum[address(0x6c2339b46F41a06f09CA0051ddAD54D1e582bA77)] = 1;
    r.quorum[address(0xb5346CF224c02186606e5f89EACC21eC25398077)] = 1;
    r.quorum[address(0xa2997F1CA363D11a0a35bB1Ac0Ff7849bc13e914)] = 1;

    // launch an event to be detected by oracle outside of blockchain
    emit NewRequest (
      currentId,
      _urlToQuery,
      _attributeToFetch
    );

    // increase request id
    currentId++;
  }

  //called by the oracle to record its answer
  function updateRequest (
    uint _id,
    string memory _valueRetrieved
  ) public {

    Request storage currRequest = requests[_id];

    //check if oracle is in the list of trusted oracles
    //and if the oracle hasn't voted yet
    if(currRequest.quorum[address(msg.sender)] == 1){

      //marking that this address has voted
      currRequest.quorum[msg.sender] = 2;

      //iterate through "array" of answers until a position if free and save the retrieved value
      uint tmpI = 0;
      bool found = false;
      while(!found) {
        //find first empty slot
        if(bytes(currRequest.answers[tmpI]).length == 0){
          found = true;
          currRequest.answers[tmpI] = _valueRetrieved;
        }
        tmpI++;
      }

      uint currentQuorum = 0;

      //iterate through oracle list and check if enough oracles(minimum quorum)
      //have voted the same answer has the current one
      for(uint i = 0; i < totalOracleCount; i++){
        bytes memory a = bytes(currRequest.answers[i]);
        bytes memory b = bytes(_valueRetrieved);

        if(keccak256(a) == keccak256(b)){
          currentQuorum++;
          if(currentQuorum >= minQuorum){
            currRequest.agreedValue = _valueRetrieved;
            emit UpdatedRequest (
              currRequest.id,
              currRequest.urlToQuery,
              currRequest.attributeToFetch,
              currRequest.agreedValue
            );
          }
        }
      }
    }
  }
}

```

预言机的节点的常见任务是，想 api 发送请求，解析响应以提取相关数据，设置为区块链可读的输出格式，并通过将输入包含在预言机合约的交易中将其发送到链上，在利用“真实性证明”证明所提交信息的有效性和完整性时，可能也会用到预言机节点。

预言机类型：

- 中心化预言机，由单体控制，该实体负责聚合链下信息并按照请求更新预言机合约的数据，中心化预言机效率高，因为他们依赖单一真实性来源，在专有数据集由所有者直接发布且有公认签名的情况下，中心化预言机可能是更好的选择。但是存在低正确性保障和可用性差的问题，中心化预言机的提供者如何关闭服务或者遭遇了黑客的攻击的话，智能合约会面临 Dos 攻击的风险
- 去中心化预言机，会尝试不同的方法实现数据的正确性，其中包括使用证明来证明返回信息的真实性和完整性。

## 预言机的应用

- 检索金融数据
  DeFi 应用允许 p2p 贷款，借贷和资产交易，需要获取不同的金融信息，包括汇率数据的资本市场数据，常用的如：Chainlink price Feeds、Compound Protocol 的[开放式喂价工具](https://docs.compound.finance/v2/prices/)、Uniswap 的[时间加权平均价格(TWAP)](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles)
- 生成可验证的随机性
  某些区块链的应用程序（如基于区块链的游戏或彩票方案），需要高度的不可预测性和随机性才能工作，然而，区块链的确定性执行消除了任何随机来源
  通常方法是伪随机密码函数，例如 blockhash，但是以太坊过渡到权益证明意味着不能再依靠 blockhash 获得链上随机性。可以在链下生成随机值并发送到链上，但这样做对用户有很高的信任要求，他们必须相信值确实是通过不可预测的机制产生的，并且在传输过程中未被改动。
  计算预言机则可以解决这一问题，可以安全的生成链下随机结果并连同证实该过程不可预测性的加密证明一起在链上广播。
- 获取事件结果
  预言机可以创建响应真实事件的智能合约，预言机服务可以允许合约通过链下组件连接到外部应用程序接口并使用来自这些数据源的信息。
- 智能合约自动化

## 预言机应用

- [Chainlink](https://chain.link/)
- [Witnet](https://witnet.io/)
- [UMA 预言机](https://uma.xyz/)
- [Tellor](https://tellor.io/)
- [Band Protocol](https://bandprotocol.com/)
- [Provable](https://provable.xyz/)
- [Paralink](https://paralink.network/)
- [Dos.Network](https://dos.network/)
- [Pyth](https://pyth.network/)
