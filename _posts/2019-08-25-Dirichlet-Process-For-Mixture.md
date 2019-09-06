---
layout: post
title: Dirichlet Process for mixture modeling and Application
img_excerpt: imgs/3d-clusters.png
---
## Introduction



* Most of the time, cluster consists in model with fixed number of clusters such as k-means or mixture of Gaussians.
* Non parametric model, want to grow the number of clusters as the number of data grows, as well as the number of parameters.
* Proper may to model and infer number of clusters.
* Complexify the model with the complexity of the data in a automatic manner.

## The Dirichlet process

### Formal Definition

The Dirichlet process is a stochastic process, whose finite distribution follows the Dirichlet distribution i.e:

$$ G \sim DP(\alpha, H) $$

$$ (G(A_{1}), ..., G(A_{n})) \sim Dirichlet(\alpha H(A_{1}), ..., \alpha H(A_{n})) $$

(Existence through the Extension theorem of Kolmogorov).

* Distribution over distribution.
* Prior over distribution.
* Same support with infinitely countable number of elements.

$$\theta_{i} \sim G$$ are i.i.d, however, marginalized over $$G$$ they are not independant, in particular, we can show that :

$$G | \theta_{1},..., \theta_{n} \sim DP \Bigg( n + \alpha, \frac{\alpha H + \sum\limits_{i = 1}^{n} \delta_{\theta_{i}}}{n + \alpha} \Bigg)$$

In particular, marginalized over G,

$$\theta_{n+1} | \theta_{1},..., \theta_{n} \sim \frac{\alpha H + \sum\limits_{i = 1}^{n} \delta_{\theta_{i}}}{n + \alpha}$$

### The Chinese Restaurant process

We don't expect all the $$\theta_{i}$$ to have distinct values, we can thus reinterpret our parameters $$ (\theta_{i})_{i = 1:n} $$ to the parameters $$\{ (\theta_{i}^{*})_{i = 1:K}, (S_{i})_{i = 1:K}\}$$ where $$\theta_{i}^{*} \sim H$$ and $$(S_{1}, ..., S_{K})$$ is a partition of $$[n]$$, where $$S_{k}$$ corresponds to the labels $$i$$ such that $$\theta_{i} = \theta_{k}^{*}$$. From this interpretation, we have:

$$
\theta_{n+1} | \theta_{1},..., \theta_{n} = \left\{
    \begin{array}{ll}
        \theta_{k}^{*} & \mbox{with probability } \frac{|S_{k}|}{n + \alpha} \\
        \theta_{K + 1}^{*} & \mbox{with probability } \frac{\alpha}{n + \alpha}
    \end{array}
\right.
$$

This operation is called the "Chinese restaurant process", where the $$(\theta_{i})_{i}$$ can be interpreted as clients entering a restaurant, and choosing a table with a probability proportional to the number of clients sitting at this table, and a probability to choose a new table proportional to $$\alpha$$.

By following this iterative process we can directly infer the joint probability of the reparametrization:

$$ \pi(((\theta_{i}^{*}), S)) = P_{\alpha}(S) \times \prod\limits_{k = 1}^{K} H(\theta_{k}^{*}) $$
Where $$ P_{\alpha}(S) = \frac{\Gamma(\alpha) \alpha^{K} \prod\limits_{k = 1}^{K}\Gamma(n_{k})}{\Gamma(\alpha + n)} $$

### Stick Breaking Rule

There exist a way to sample a distribution G from $$DP(\alpha, H)$$ called "stick breaking rule" that works as follows:

* Sample $$(w_{i})_{i = 1,...} \sim Beta(1,\alpha)$$
* Sample $$(\theta_{i}^{*})_{i = 1,...} \sim H$$
* Compute $$\pi_{i}(w) = w_{i}*\prod\limits_{j = 1}^{i - 1}(1 - w_{j})$$
* Return $$G = \sum\limits_{i = 1}^{\infty} \pi_{i}(w)\delta_{\theta_{i}^{*}}$$

{% include image.html url="/imgs/plotBreak.png" description="Exemple of samples from the Dirichlet Process centered on a Gaussian with alpha equal to 1 ,10 and 100." %}

## Dirichlet process for Mixture

### Finite Mixture

A finite mixture model assumes that the data come from a mixture of a finite number of distributions.

$$\pi \sim Dirichlet(\frac{\alpha}{K}, ...,  \frac{\alpha}{K})$$

$$c_{n} \sim Multinomial(\pi)$$

$$\theta_{k}^{*} \sim H$$

$$y_{n} | c_{n}, (\theta_{k}^{*})_{k = 1...K} \sim f(.|\theta_{c_{n}}^{*})$$

### Dirichlet Process for Mixture

It can be showed that the marginal distribution converge in distribution to the marginal distribution arising from the Dirichlet Process for mixture modeling.

$$G \sim DP(\alpha, H)$$

$$\theta_{i} \sim G$$

$$y_{i}|\theta_{i} \sim f(.|\theta_{i})$$

## Inference

In a DP model for mixture, we assume that the data are generated in the following way:

$$
    y_{i} \sim f(y_{i} | \theta_{i})
$$

With the following prior for $$\theta$$:

$$
    \theta \sim G
$$

$$
    G \sim DP(\alpha, H)
$$

Hence, the Bayes rule translates into, with the representation given above:

$$
    \pi((\theta^{*}, S) | y) \propto f(y | \theta^{*}, S) P_{\alpha}(S) \prod\limits_{k = 1}^{K}h(\theta^{*}_{k})
$$

Techniques : MCMC + Variational Inference

### Gibbs Sampling

Choosing f and H such that conjugate priors allow us to derive a Gibbs sampler.

$$
    \pi(\theta_{k}^{*} | \theta_{-k}^{*}, (y_{i})_{i}) \propto h(\theta_{k}^{*}) \times \prod\limits_{i \in S_{k}}f(y_{i}|\theta_{k}^{*})
$$

$$
    P(i \in S'^{k} | S^{-i}, y, \theta^{*}_{-i}) = \left\{
    \begin{array}{ll}
        \frac{|S_{k}^{-i}|}{n - 1 + \alpha} \times f(y_{i}|\theta^{*}_{k}) & \mbox{for } k = 1,...,K^{-i} \\
        \frac{\alpha}{n - 1 + \alpha} \times \int f(y_{i}|\theta^{*})dH(\theta^{*}) & \mbox{for } k = K^{-i} + 1
    \end{array}
\right.
$$

If a new cluster is created, draw
$$\theta^{*} \sim \pi(\theta^{*} | y_{i}) \propto f(y_{i} | \theta^{*})H(\theta^{*})$$

### Conjugate priors

with

$$\theta^{*}_{k} = (\boldsymbol{\mu}_{k}^{*}, \boldsymbol{\Sigma}_{k}^{*})$$

$$y_{i} \sim \mathcal{N}(\boldsymbol{\mu_{k}}^{*}, \boldsymbol{\Sigma}_{k}^{*})$$

$$(\boldsymbol{\mu_{k}}^{*}, \boldsymbol{\Sigma_{k}}^{*}) \sim NIW(\boldsymbol{\mu}_{0}, \lambda, \boldsymbol{\Psi}, \nu)$$

In this case we have:
$$
    \theta_{k}^{*} | y \sim NIW(\boldsymbol{\mu}_{n}, \lambda_{n}, \boldsymbol{\Psi}_{n}, \nu_{n})
$$

Where

$$
    \boldsymbol{\mu_{n}} = \frac{\lambda \boldsymbol{\mu}_{0} + n\boldsymbol{\bar{y}}}{\lambda + n}
$$

$$
    \lambda_{n} = \lambda + n
$$

$$
    \nu_{n} = \nu + n
$$

$$
    \boldsymbol{\Psi}_{n} =  \frac{\nu}{\nu + n} \boldsymbol{\Psi} + \boldsymbol{S} + \frac{\lambda n}{\lambda + n} (\boldsymbol{\bar{y}} - \boldsymbol{\mu_{0}})(\boldsymbol{\bar{y}} - \boldsymbol{\mu}_{0})^{T}
$$

With

$$
    \boldsymbol{S} = \sum\limits_{i = 1}^{n} (\boldsymbol{y}_{i} - \boldsymbol{\bar{y}})(\boldsymbol{y}_{i} - \boldsymbol{\bar{y}})^{T}
$$

The predictive likelihood follows a multivariate student t distribution with $$(\nu_{n} - d + 1)$$ that we will approximate by moment matching by a gaussian:

$$
    p(y | \boldsymbol{\mu}_{0}, \lambda, \boldsymbol{\Psi}, \nu) \sim \mathcal{N}(y; \boldsymbol{\mu}_{0}, \frac{(\lambda + 1)\nu}{\lambda(\nu - p - 1)} \boldsymbol{\Psi})
$$

## Discussion

This model allows to perforw non parametric bayesian inference, however, it shifts the problem to the design of the prior which establish the size a priori of a cluster.
