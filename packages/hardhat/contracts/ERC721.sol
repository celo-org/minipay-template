// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract MiniPay is
    ERC721,
    ERC721URIStorage,
    ERC721Pausable,
    Ownable,
    ERC721Burnable
{
    uint256 private _nextTokenId;

    constructor(
        address initialOwner
    ) ERC721("MiniPay", "MINI") Ownable(initialOwner) {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getNFTsByAddress(
        address owner
    ) public view returns (uint256[] memory) {
        uint256 totalNFTs = _nextTokenId; // Assuming _nextTokenId reflects totalSupply
        uint256[] memory ownedTokenIds = new uint256[](totalNFTs);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalNFTs; i++) {
            try ERC721(address(this)).ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    ownedTokenIds[currentIndex++] = i;
                }
            } catch Error(string memory /*reason*/) {
                // Token does not exist or lookup failed
                break; // Optimization: Stop checking at non-existent tokens
            }
        }

        // Resize the array to return only owned tokens
        assembly {
            mstore(ownedTokenIds, currentIndex)
        }
        return ownedTokenIds;
    }
}
