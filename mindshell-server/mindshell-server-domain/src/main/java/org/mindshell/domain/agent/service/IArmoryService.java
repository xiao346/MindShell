package org.mindshell.domain.agent.service;

import org.mindshell.domain.agent.model.valobj.AiAgentConfigTableVO;

import java.util.List;

/**
 * 装配接口
 *
 * 2025/12/17 08:13
 */
public interface IArmoryService {

    void acceptArmoryAgents(List<AiAgentConfigTableVO> tables) throws Exception;

}
